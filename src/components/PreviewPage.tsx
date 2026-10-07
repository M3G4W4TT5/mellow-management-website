import { useEffect,useRef,useState, type MouseEvent } from 'react';
import SiteView,{PrivacyView} from './SiteView';
import type {SiteContent,Locale} from '../lib/content-model';

const trustedStudioOrigins = ['https://mellow-management-website.sanity.studio','http://localhost:3333','http://127.0.0.1:3333'];
export default function PreviewPage(){
 const studioOrigin=useRef<string|null>(null);
 const [content,setContent]=useState<SiteContent|null>(null);
 const [locale,setLocale]=useState<Locale>('da');
 const [privacy,setPrivacy]=useState(false);
 useEffect(()=>{
  const receive=(event:MessageEvent)=>{
   if(event.source!==window.parent || !trustedStudioOrigins.includes(event.origin) || event.data?.type!=='mellow:preview-content') return;
   if(!event.data.content || !Array.isArray(event.data.content.artists)) return;
   studioOrigin.current=event.origin;
   setContent(event.data.content);setLocale(event.data.locale==='en'?'en':'da');setPrivacy(event.data.page==='privacy');
   document.documentElement.lang=event.data.locale==='en'?'en':'da';
  };
  window.addEventListener('message',receive);
  // No draft data or credentials are fetched by this public, empty preview route.
  if(window.parent!==window) trustedStudioOrigins.forEach(origin=>window.parent.postMessage({type:'mellow:preview-ready'},origin));
  return()=>window.removeEventListener('message',receive);
 },[]);
 useEffect(()=>{document.body.classList.toggle('legal-page',privacy)},[privacy]);
 if(!content)return <main className="legal-main"><h1>Website preview</h1><p>Open the Preview tab in Mellow’s Sanity Studio to view unpublished edits.</p></main>;
 const navigate=(event:MouseEvent<HTMLDivElement>)=>{
  const anchor=(event.target as Element).closest('a');
  if(!anchor||anchor.target==='_blank')return;
  const path=anchor.getAttribute('href');
  if(!path||!['/','/en/','/privatliv/','/en/privacy/'].includes(path))return;
  event.preventDefault();
  const nextLocale:Locale=path.startsWith('/en/')?'en':'da';const nextPage=path.includes('privacy')||path.includes('privatliv')?'privacy':'home';
  setLocale(nextLocale);setPrivacy(nextPage==='privacy');document.documentElement.lang=nextLocale;
  if(studioOrigin.current)window.parent.postMessage({type:'mellow:preview-navigate',locale:nextLocale,page:nextPage},studioOrigin.current);
 };
 return <div onClick={navigate}>{privacy?<PrivacyView content={content} locale={locale}/>:<SiteView content={content} locale={locale}/>}</div>;
}
