import {createReadStream,writeFileSync} from 'node:fs';
import {getCliClient} from 'sanity/cli';
import {previewContent} from '../src/lib/content-model';
import {defaultText,defaultBrand,defaultFooter,defaultPrivacy,defaultSeo} from '../src/lib/content-defaults';

// Dry run: sanity exec migrate-content.ts --with-user-token
// Apply: MELLOW_APPLY_MIGRATION=1 sanity exec migrate-content.ts --with-user-token
const client=getCliClient({apiVersion:'2026-09-01'});
if(client.config().projectId!=='1yijqk34'||client.config().dataset!=='production')throw new Error('Wrong project/dataset');
const docs=await client.fetch('*[_type in ["artist","siteSettings","privacyPage"] && !(_id in path("versions.**"))]',{}, {perspective:'raw',useCdn:false});
const apply=process.env.MELLOW_APPLY_MIGRATION==='1';
console.log(JSON.stringify({mode:apply?'apply':'dry run',documents:docs.map((d:{_id:string;_type:string})=>({id:d._id,type:d._type})),createsPrivacy:!docs.some((d:{_id:string})=>d._id==='privacyPage')}));
if(apply){
 const backup=`/tmp/mellow-content-before-${Date.now()}.json`;
 writeFileSync(backup,JSON.stringify(docs,null,2),{mode:0o600});
 const files=new Map<string,{_type:string;asset:{_type:string;_ref:string}}>();
 const asset=async(path:string,kind:'file'|'image'='file')=>{
  if(!files.has(path)){const uploaded=await client.assets.upload(kind,createReadStream(new URL(`../public${path}`,import.meta.url)),{filename:path.split('/').pop()});files.set(path,{_type:kind,asset:{_type:'reference',_ref:uploaded._id}})}
  return files.get(path)!;
 };
 const brand={_type:'brandSettings',...defaultBrand,logo:await asset(defaultBrand.logo),mark:await asset(defaultBrand.mark),tickerMark:await asset(defaultBrand.tickerMark),favicon:await asset(defaultBrand.favicon)};
 const footer={_type:'footerSettings',...defaultFooter,creditLogo:await asset(defaultFooter.creditLogo,'image')};
 let tx=client.transaction();
 for(const doc of docs){
  if(doc._type==='siteSettings'){
   const missing:Record<string,unknown>={};
   if(doc.contactPhone===undefined)missing.contactPhone=previewContent.contactPhone;
   if(doc.text===undefined)missing.text={_type:'interfaceText',...Object.fromEntries(Object.entries(defaultText).map(([k,v])=>[k,{_type:'localizedText',...v}]))};
   else for(const[k,v]of Object.entries(defaultText))if(doc.text[k]===undefined)missing[`text.${k}`]={_type:'localizedText',...v};
   for(const [field,defaults]of Object.entries({brand,footer,seo:{_type:'seoSettings',title:defaultSeo.title}})){
    if(doc[field]===undefined)missing[field]=defaults;
    else for(const[k,v]of Object.entries(defaults))if(doc[field][k]===undefined)missing[`${field}.${k}`]=v;
   }
   const oldCreditRef=doc.footer?.creditLogo?.asset?._ref;
   const convertCredit=oldCreditRef==='file-bd0a63eb51f8a33aba933cf0f8fde2dbe9e002d5-png';
   if(Object.keys(missing).length || convertCredit)tx=tx.patch(doc._id,p=>{const update=p.ifRevisionId(doc._rev).setIfMissing(missing);return convertCredit?update.set({'footer.creditLogo':footer.creditLogo}):update});
  }
  if(doc._type==='artist' && doc.socialProfiles===undefined){
   const legacy=[...(doc.links||[])];
   if(doc._id.startsWith('drafts.')){
    const published=docs.find((d:{_id:string})=>d._id===doc._id.replace(/^drafts\./,''));
    for(const profile of published?.socialProfiles || [])if(profile.platform==='Instagram' && !legacy.some((l:{url:string})=>new URL(l.url).hostname.replace(/^www\./,'')==='instagram.com'))legacy.push({_key:profile._key,label:'Instagram',url:profile.url});
   }
   const profiles=legacy.map((link:{_key?:string;label?:string;url:string},i:number)=>{
    const host=new URL(link.url).hostname.replace(/^www\./,'');
    const platform=host==='instagram.com'?'Instagram':['facebook.com','m.facebook.com'].includes(host)?'Facebook':'Website';
    return {_type:'socialProfile',_key:link._key||`profile-${i}`,platform,url:link.url,label:{_type:'localizedText',da:link.label||platform,en:link.label||platform},showOnCard:platform!=='Website',showInDetails:true};
   });
   tx=tx.patch(doc._id,p=>p.ifRevisionId(doc._rev).setIfMissing({socialProfiles:profiles,card:{_type:'cardContent',showSpotify:true},spotifyEmbedVisible:true}));
  }
 }
 tx=tx.createIfNotExists({_id:'privacyPage',_type:'privacyPage',...defaultPrivacy});
 await tx.commit();
 console.log(JSON.stringify({status:'complete',backup,uploadedAssets:files.size}));
}
