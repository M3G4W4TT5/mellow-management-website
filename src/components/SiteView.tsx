import type { CSSProperties } from 'react';
import { PortableText } from '@portabletext/react';
import { copy, localized, safeHttps, type Locale, type SiteContent } from '../lib/content-model';
import ArtistBrowser from './ArtistBrowser';
import HeroCollage from './HeroCollage';
import ArrowUpRight from './ArrowUpRight';
import DepthText from './DepthText';

type Props = {content:SiteContent;locale:Locale};
const headingDepth = {layers:8,depth:2.6,tilt:8,pointerTracking:true,smoothing:0.17,perspective:1500,autoOrbit:false,orbitSpeed:0.35,shadow:false} as const;
export function SiteHeader({content,locale,privacy=false}:Props & {privacy?:boolean}) {
 const da=locale==='da'; const home=da?'/':'/en/';
 return <><a className="skip-link" href="#main">{copy(content,'skipLink',locale)}</a>
 <header className="site-header"><a className="brand" href={home} aria-label={copy(content,'homeAccessibleLabel',locale)}><img src={content.brand.logo} alt={content.brand.name} width="166" height="52"/></a>
 <nav className="site-nav" aria-label={copy(content,'navigationLabel',locale)}>
 {privacy?<a href={home}>{copy(content,'backToHome',locale)} <ArrowUpRight/></a>:<><a href="#artists">{copy(content,'artistsLink',locale)}</a><a href="#contact">{copy(content,'contactLink',locale)}</a></>}
 <a className="language-switch" href={privacy?(da?'/en/privacy/':'/privatliv/'):(da?'/en/':'/')} lang={da?'en':'da'} aria-label={copy(content,'languageAccessibleLabel',locale)}>{copy(content,'languageLabel',locale)}</a>
 </nav></header></>;
}
export function SiteFooter({content,locale}:Props){
 const footer=content.footer;
 return <footer className="site-footer"><div className="site-footer__name"><img src={content.brand.logo} alt={content.brand.name} width="360" height="113"/><span>®</span></div>
 <div className="site-footer__info"><span>{copy(content,'companyNumberLabel',locale)} {footer.companyNumber}</span><span style={{whiteSpace:'pre-line'}}>{localized(footer.address,locale)}</span><a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a></div>
 <div className="site-footer__links"><a href={locale==='da'?'/privatliv/':'/en/privacy/'}>{copy(content,'privacyLink',locale)}</a><a href="#main">{copy(content,'backToTop',locale)} ↑</a></div>
 <div className="site-footer__bottom"><span>© {new Date().getFullYear()} {footer.copyrightName}</span>
 <a className="site-footer__design-credit" href={safeHttps(footer.creditUrl)?footer.creditUrl:undefined} aria-label={`${localized(footer.creditLabel,locale)} ${footer.creditName}`}><span>{localized(footer.creditLabel,locale)}</span><span className="site-footer__design-logo" style={{'--credit-logo':`url(${JSON.stringify(footer.creditLogo)})`} as CSSProperties} aria-hidden="true"/></a></div></footer>;
}
export default function SiteView({content,locale}:Props){
 return <><SiteHeader content={content} locale={locale}/><main id="main">
 <section className="hero" aria-labelledby="hero-title"><div className="hero__title-wrap"><h1 id="hero-title"><DepthText
 lines={[
   {text:content.brand.heroLineOne,faceColor:'var(--green)',depthColor:'var(--pink)'},
   {text:content.brand.heroLineTwo,faceColor:'var(--pink)',depthColor:'var(--green)'},
 ]}
 {...headingDepth}
 /></h1></div>
 <HeroCollage artists={content.artists} locale={locale} text={content.text} markUrl={content.brand.mark}/><div className="hero__bottom"><p>{localized(content.intro,locale)}</p></div></section>
 <div className="artist-ticker" aria-hidden="true"><div className="artist-ticker__track">{[0,1].flatMap(repetition=>content.artists.map(artist=><span key={`${repetition}-${artist.slug}`}>{artist.name}<img src={content.brand.tickerMark} alt=""/></span>))}</div></div>
 <section className="artists-section" id="artists" aria-labelledby="artists-heading"><h2 id="artists-heading"><DepthText {...headingDepth} wrap lines={[{text:copy(content,'artistsHeading',locale),faceColor:'currentColor',depthColor:'var(--yellow)'}]}/></h2><p className="artists-section__intro">{copy(content,'artistsSubtitle',locale)}</p><ArtistBrowser key={content.artists.map(a=>a.slug).join(':')} artists={content.artists} locale={locale} text={content.text}/></section>
 <section className="contact-section" id="contact" aria-labelledby="contact-heading" style={{'--mellow-mark':`url(${JSON.stringify(content.brand.mark)})`} as CSSProperties}><div className="contact-section__grid"><div className="contact-section__intro"><h2 id="contact-heading"><DepthText {...headingDepth} wrap lines={[{text:localized(content.contactTitle,locale),faceColor:'currentColor',depthColor:'var(--pink)'}]}/></h2></div><div className="contact-section__links"><a className="contact-section__link" href={`mailto:${content.contactEmail}`}>{content.contactEmail} <ArrowUpRight/></a><a className="contact-section__link" href={`tel:${content.contactPhone.replace(/[^+\d]/g,'')}`}>{content.contactPhone} <ArrowUpRight/></a></div></div></section>
 </main><SiteFooter content={content} locale={locale}/></>;
}
export function PrivacyView({content,locale}:Props){
 const home=locale==='da'?'/':'/en/';
 return <><SiteHeader content={content} locale={locale} privacy/><main className="legal-main" id="main"><span className="micro-label">{content.brand.name} / {copy(content,'privacyLink',locale)}</span><h1>{localized(content.privacy.title,locale)}</h1>
 {content.privacy.sections.map(section=><section key={section._key}><h2>{localized(section.title,locale)}</h2>{section.kind==='responsible'?<p>{content.brand.name}, {copy(content,'companyNumberLabel',locale)} {content.footer.companyNumber}, {localized(content.footer.address,locale).replace(/\n/g,', ')}. {copy(content,'responsibleContactLabel',locale)}: <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>.</p>:<PortableText value={section.body?.[locale] || section.body?.da || []} components={{marks:{link:({children,value})=><a href={safeHttps(value?.href)?value.href:undefined}>{children}</a>,contactEmail:()=> <a href={`mailto:${content.contactEmail}`}>{content.contactEmail}</a>}}}/>}</section>)}
 <p><a href={home}>← {copy(content,'backToHome',locale)}</a></p></main></>;
}
