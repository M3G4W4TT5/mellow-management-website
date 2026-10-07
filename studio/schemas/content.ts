import { defineArrayMember, defineField, defineType } from 'sanity';
import { defaultText } from '../../src/lib/content-defaults';

export const fileAsset = (name: string, title: string, description: string) => defineField({ name, title, description, type: 'file', options: { accept: 'image/svg+xml,image/png,image/webp,image/jpeg,image/x-icon' } });
export const artistImage = (name: string, title: string) => defineField({ name, title, type: 'image', options: { hotspot: true }, fields: [
  defineField({ name:'alt',title:'Image description',type:'localizedText',validation:Rule=>Rule.required() }),
  defineField({ name:'credit',title:'Photographer credit',type:'string' }),
  defineField({ name:'rightsNote',title:'Usage / crop notes (internal)',type:'text',rows:2 }),
] });
export const localizedOptionalText=defineType({name:'localizedOptionalText',title:'Optional Danish / English text',type:'object',fields:[defineField({name:'da',title:'Dansk',type:'text',rows:3}),defineField({name:'en',title:'English',type:'text',rows:3,validation:Rule=>Rule.custom((value,context)=>!((context.parent as {da?:string})?.da)||Boolean(value)||'English is missing; Danish will be used.').warning()})]});
export const interfaceText = defineType({ name:'interfaceText',title:'Shared Danish / English labels',type:'object',fields:Object.keys(defaultText).map(name=>defineField({name,title:name.replace(/([A-Z])/g,' $1').replace(/^./,c=>c.toUpperCase()),type:'localizedText'})) });
export const brandSettings = defineType({ name:'brandSettings',title:'Brand & logos',type:'object',fields:[
  defineField({name:'name',title:'Company / site name',type:'string',validation:Rule=>Rule.required()}),
  defineField({name:'heroLineOne',title:'First hero title line',type:'string',validation:Rule=>Rule.required().max(24)}),
  defineField({name:'heroLineTwo',title:'Second hero title line',type:'string',validation:Rule=>Rule.required().max(32)}),
  fileAsset('logo','Full logo','Transparent logo including MANAGEMENT; shared by header, footer and privacy pages.'),
  fileAsset('mark','Logo mark','Lips with MELLOW inside, without MANAGEMENT. Used for the coin, kisses and contact decoration.'),
  fileAsset('tickerMark','Scrolling banner mark','Lips-only mark used between artist names in the yellow banner.'),
  fileAsset('favicon','Browser icon','Small transparent SVG, PNG or ICO.'),
] });
export const footerSettings = defineType({ name:'footerSettings',title:'Footer & company information',type:'object',fields:[
  defineField({name:'companyNumber',title:'Company registration number',type:'string'}),
  defineField({name:'address',title:'Address',type:'localizedText'}),
  defineField({name:'copyrightName',title:'Copyright name',type:'string',description:'The year updates automatically.'}),
  defineField({name:'creditLabel',title:'Design credit label',type:'localizedText'}),
  defineField({name:'creditName',title:'Designer name / accessible logo label',type:'string'}),
  defineField({name:'creditUrl',title:'Designer website',type:'url',validation:Rule=>Rule.uri({scheme:['https']})}),
  defineField({name:'creditLogo',title:'Design credit logo',type:'image',options:{hotspot:false},description:'Transparent Memory(One) logo; displayed in Mellow pink.'}),
] });
export const seoSettings = defineType({ name:'seoSettings',title:'Search & sharing',type:'object',fields:[
  defineField({name:'title',title:'Page title',type:'localizedText'}),
  defineField({name:'description',title:'Page description',type:'localizedOptionalText',description:'Empty uses the introduction.'}),
  artistImage('sharingImage','Social sharing image'),
] });
export const cardContent = defineType({name:'cardContent',title:'Hero card back',type:'object',fields:[
  defineField({name:'title',title:'Card back title',type:'localizedText',description:'Empty uses the artist name.'}),
  defineField({name:'body',title:'Optional short card text',type:'localizedText',validation:Rule=>Rule.custom(value=>!value || Object.values(value).every(v=>typeof v!=='string'||v.length<=180)||'Keep each translation under 180 characters.')}),
  defineField({name:'readMore',title:'Read more label override',type:'localizedText',description:'Empty uses the shared Read more label.'}),
  defineField({name:'showSpotify',title:'Show Spotify icon on card',type:'boolean',initialValue:true}),
]});
export const socialProfile = defineType({name:'socialProfile',title:'Public social / website profile',type:'object',fields:[
  defineField({name:'platform',title:'Platform / icon',type:'string',options:{list:['Instagram','Facebook','Website']},validation:Rule=>Rule.required()}),
  defineField({name:'url',title:'Public profile URL',type:'url',validation:Rule=>Rule.required().uri({scheme:['https']}).custom((value,context)=>{
    if(!value) return true;
    try { const host=new URL(value).hostname.replace(/^www\./,'');const platform=context.parent && (context.parent as {platform?:string}).platform;
      return platform==='Instagram' ? host==='instagram.com'||'Use an instagram.com public profile.' : platform==='Facebook' ? ['facebook.com','m.facebook.com'].includes(host)||'Use a facebook.com public profile.' : true;
    }catch{return 'Enter a valid HTTPS URL.'}
  })}),
  defineField({name:'label',title:'Artist details link label',type:'localizedText',description:'Empty uses the platform name.'}),
  defineField({name:'showOnCard',title:'Show icon on card back',type:'boolean',initialValue:true}),
  defineField({name:'showInDetails',title:'Show link in artist details',type:'boolean',initialValue:true}),
],preview:{select:{title:'platform',subtitle:'url'}}});
export const richText = defineType({name:'richText',title:'Text with links',type:'array',of:[defineArrayMember({type:'block',styles:[{title:'Paragraph',value:'normal'}],lists:[{title:'Bullet list',value:'bullet'},{title:'Numbered list',value:'number'}],marks:{decorators:[{title:'Bold',value:'strong'},{title:'Italic',value:'em'}],annotations:[
  defineField({name:'link',title:'External link',type:'object',fields:[defineField({name:'href',title:'URL',type:'url',validation:Rule=>Rule.required().uri({scheme:['https']})})]}),
  defineField({name:'contactEmail',title:'Current contact email',type:'object',fields:[defineField({name:'note',title:'Note',type:'string',readOnly:true,initialValue:'Uses the email in site settings.'})]}),
]}})]});
export const localizedRichText = defineType({name:'localizedRichText',title:'Danish / English rich text',type:'object',fields:[defineField({name:'da',title:'Dansk',type:'richText'}),defineField({name:'en',title:'English',type:'richText'})]});
export const policySection = defineType({name:'policySection',title:'Privacy section',type:'object',fields:[
  defineField({name:'title',title:'Section heading',type:'localizedText',validation:Rule=>Rule.required()}),
  defineField({name:'kind',title:'Content',type:'string',initialValue:'text',options:{list:[{title:'Editable text',value:'text'},{title:'Company details from site settings',value:'responsible'}]},validation:Rule=>Rule.required()}),
  defineField({name:'body',title:'Section text',type:'localizedRichText',hidden:({parent})=>parent?.kind==='responsible'}),
],preview:{select:{title:'title.da'}}});
export const privacyPage = defineType({name:'privacyPage',title:'Privacy page',type:'document',fields:[
  defineField({name:'title',title:'Page heading',type:'localizedText',validation:Rule=>Rule.required()}),
  defineField({name:'seoTitle',title:'Browser / search title',type:'localizedText'}),
  defineField({name:'description',title:'Page description',type:'localizedOptionalText'}),
  defineField({name:'sections',title:'Policy sections',type:'array',of:[defineArrayMember({type:'policySection'})],validation:Rule=>Rule.min(1)}),
],preview:{prepare:()=>({title:'Privacy page'})}});
