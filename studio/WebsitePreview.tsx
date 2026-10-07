import {useCallback,useEffect,useRef,useState} from 'react';
import {useClient,type SanityDocument} from 'sanity';
import {normalizeContent,SITE_CONTENT_QUERY,type RawContent,type RawArtist,type Locale} from '../src/lib/content-model';

type Props={document:{displayed:SanityDocument|null}};
const previewOrigin=process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'https://mellow-management-website.pages.dev';
const destination=new URL('/preview/',previewOrigin);
if(destination.protocol!=='https:' && !['localhost','127.0.0.1'].includes(destination.hostname))throw new Error('Studio preview requires HTTPS');
export default function WebsitePreview({document}:Props){
 const client=useClient({apiVersion:'2026-09-01'});
 const iframe=useRef<HTMLIFrameElement>(null);
 const payload=useRef<unknown>(null);
 const revision=useRef(0);
 const [locale,setLocale]=useState<Locale>('da');
 const [page,setPage]=useState(document.displayed?._type==='privacyPage'?'privacy':'home');
 const [error,setError]=useState('');
 const send=useCallback(()=>{if(payload.current)iframe.current?.contentWindow?.postMessage(payload.current,destination.origin)},[]);
 useEffect(()=>{
  const ready=(event:MessageEvent)=>{
   if(event.origin!==destination.origin || event.source!==iframe.current?.contentWindow)return;
   if(event.data?.type==='mellow:preview-ready')send();
   if(event.data?.type==='mellow:preview-navigate'){setLocale(event.data.locale==='en'?'en':'da');setPage(event.data.page==='privacy'?'privacy':'home')}
  };
  window.addEventListener('message',ready);return()=>window.removeEventListener('message',ready);
 },[send]);
 useEffect(()=>{
  const generation=++revision.current;
  const refresh=async()=>{
   try {
    const raw=await client.fetch<RawContent>(SITE_CONTENT_QUERY,{}, {perspective:'drafts',useCdn:false});
    const doc=document.displayed?structuredClone(document.displayed):null;
    if(doc?._type==='siteSettings') raw.settings=doc as RawContent['settings'];
    if(doc?._type==='privacyPage') raw.privacy=doc as RawContent['privacy'];
    if(doc?._type==='artist'){
     const current={...doc,slug:(doc.slug as {current?:string})?.current} as unknown as RawArtist;
     const id=doc._id.replace(/^drafts\./,'');
     raw.artists=(raw.artists || []).filter(a=>a._id.replace(/^drafts\./,'')!==id);
     if(doc.visible!==false)raw.artists.push(current);
     raw.artists.sort((a,b)=>(a.displayOrder ?? 100)-(b.displayOrder ?? 100)||(a.name || '').localeCompare(b.name || ''));
    }
    // Resolve unsaved asset references with the editor's authenticated client.
    const refs=new Set<string>();
    const collect=(value:unknown)=>{if(!value||typeof value!=='object')return;for(const [key,v]of Object.entries(value)){if(key==='asset'&&v&&typeof v==='object'&&'_ref'in v)refs.add(String(v._ref));else collect(v)}};
    collect(raw);
    const assets=refs.size?await client.fetch<{_id:string;url:string}[]>('*[_id in $ids]{_id,url}',{ids:[...refs]}):[];
    const urls=new Map(assets.map(a=>[a._id,a.url]));
    const resolve=(value:unknown)=>{if(!value||typeof value!=='object')return;for(const [key,v]of Object.entries(value)){if(key==='asset'&&v&&typeof v==='object'&&'_ref'in v)Object.assign(v,{url:urls.get(String(v._ref))});else resolve(v)}};
    resolve(raw);
    if(generation!==revision.current)return;
    payload.current={type:'mellow:preview-content',content:normalizeContent(raw,client.config().projectId!,client.config().dataset!),locale,page};
    setError('');send();
   }catch(e){if(generation===revision.current)setError(e instanceof Error?e.message:'Could not load draft preview')}
  };
  const timer=setTimeout(refresh,300);
  const subscription=client.listen('*[_type in ["artist","siteSettings","privacyPage"]]',{}, {includeResult:false}).subscribe(()=>refresh());
  return()=>{clearTimeout(timer);subscription.unsubscribe();revision.current++};
 },[client,document.displayed,locale,page,send]);
 return <div style={{height:'100%',display:'flex',flexDirection:'column'}}><div style={{padding:12,display:'flex',gap:16,alignItems:'center'}}><label>Language <select value={locale} onChange={e=>setLocale(e.target.value as Locale)}><option value="da">Dansk</option><option value="en">English</option></select></label><label>Page <select value={page} onChange={e=>setPage(e.target.value)}><option value="home">Home</option><option value="privacy">Privacy</option></select></label><span>Unpublished edits · only visible here</span></div>{error&&<p role="alert">{error}</p>}<iframe ref={iframe} title="Mellow website draft preview" src={destination.href} onLoad={send} style={{border:0,flex:1,minHeight:500,width:'100%'}}/></div>;
}
