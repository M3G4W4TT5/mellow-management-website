import { createImageUrlBuilder } from '@sanity/image-url';
import { defineQuery } from 'groq';
import type {SITE_CONTENT_QUERY_RESULT} from './sanity.types';
import { defaultText, defaultBrand, defaultFooter, defaultPrivacy, defaultSeo } from './content-defaults';

export type Locale = 'da' | 'en';
export type Localized = { da: string; en?: string; _key?: string };
export type Artist = {
  slug: string;
  name: string;
  description: Localized;
  achievements: Localized[];
  imageUrl?: string;
  heroImageUrl?: string;
  thumbImageUrl?: string;
  heroImageAlt?: Localized;
  card?: { title?: Localized; body?: Localized; readMore?: Localized; showSpotify?: boolean };
  spotifyEmbedVisible?: boolean;
  imageAlt?: Localized;
  imageCredit?: string;
  spotifyArtistUrl?: string;
  links: ArtistLink[];
  color: string;
};
export type ArtistLink = { _key?: string; label: string | Localized; url: string; platform?: 'Instagram' | 'Facebook' | 'Website'; showOnCard?: boolean; showInDetails?: boolean };
export type Brand = typeof defaultBrand;
export type Footer = typeof defaultFooter;
export type Privacy = typeof defaultPrivacy;
export type UITextKey = keyof typeof defaultText;
export type SiteContent = {
  text: Record<UITextKey, Localized>;
  brand: Brand;
  footer: Footer;
  privacy: Privacy;
  seo: typeof defaultSeo;
  intro: Localized;
  contactTitle: Localized;
  contactEmail: string;
  contactPhone: string;
  artists: Artist[];
  source: 'sanity' | 'preview';
};

export function localized(value: Localized | undefined, locale: Locale): string {
  return value?.[locale] || value?.da || '';
}

export const previewContent: SiteContent = {
  source: 'preview',
  text: defaultText, brand: defaultBrand, footer: defaultFooter, privacy: defaultPrivacy, seo: defaultSeo,
  intro: {
    da: 'God musik skabes af mennesker med noget på hjerte. Mellow Management arbejder med danske artister, der har deres egen lyd og sætter musikken og kunsten først.',
    en: 'Great music comes from people with something to say. Mellow Management works with Danish artists who have their own sound and put music and art first.',
  },
  contactTitle: { da: 'Lad os tale musik.', en: 'Let’s talk music.' },
  contactEmail: 'john@mellowmanagement.com',
  contactPhone: '+45 51 88 12 34',
  artists: [
    {
      slug: 'bette', name: 'Bette', color: '#DF597D',
      description: {
        da: 'Dansksproget r&b med plads til både selvtillid og tvivl. På albummet EGO giver Bette sin indre stemme frit spil.',
        en: 'Danish-language R&B with room for both confidence and doubt. On EGO, Bette gives her inner voice free rein.',
      },
      achievements: [{ da: 'Roskilde Festival i 2025 og et udsolgt Store VEGA i 2026.', en: 'Roskilde Festival in 2025 and a sold-out Store VEGA in 2026.' }],
      imageUrl: '/images/bette.webp',
      imageAlt: { da: 'Bette, presseportræt', en: 'Bette, press portrait' },
      spotifyArtistUrl: 'https://open.spotify.com/artist/4gepV1NXit1T15YxX0Bv27',
      links: [{ label: 'Instagram', url: 'https://www.instagram.com/bettefiddy/' }],
    },
    {
      slug: 'rasmus-rydahl', name: 'Rasmus Rydahl', color: '#254BCC',
      description: {
        da: 'Sanger, sangskriver og multiinstrumentalist, der skriver dansksprogede sange om kærlighed, tvivl og alt det, der er svært at få sagt.',
        en: 'A singer, songwriter and multi-instrumentalist writing Danish-language songs about love, doubt and the things that are hard to say.',
      },
      achievements: [{ da: 'Udvalgt til DR’s KarriereKanonen med “Stå For Dig”.', en: 'Selected for DR’s KarriereKanonen with “Stå For Dig”.' }],
      imageUrl: '/images/rasmus-rydahl.webp',
      imageAlt: { da: 'Rasmus Rydahl, presseportræt', en: 'Rasmus Rydahl, press portrait' },
      imageCredit: 'Frederik Barasinki',
      spotifyArtistUrl: 'https://open.spotify.com/artist/6tbEOV15fjBGjAJMGDIl3q',
      links: [{ label: 'Instagram', url: 'https://www.instagram.com/rasmusrydahl/' }],
    },
    {
      slug: 'pauline', name: 'Pauline', color: '#215946',
      description: {
        da: 'Pauline skriver nære, poetiske popsange med en stemme, der kan bære både det skrøbelige og det store.',
        en: 'Pauline writes intimate, poetic pop songs with a voice that carries both fragility and grandeur.',
      },
      achievements: [{ da: 'Debutsinglen “Ny Og Næ” blev P3’s Uundgåelige; siden fulgte albummet Noget For Nogen.', en: 'Debut single “Ny Og Næ” was named P3’s Uundgåelige, followed by the album Noget For Nogen.' }],
      imageUrl: '/images/pauline.webp',
      imageAlt: { da: 'Pauline, presseportræt', en: 'Pauline, press portrait' },
      imageCredit: 'Rita Kuhlmann',
      spotifyArtistUrl: 'https://open.spotify.com/artist/1FdCucmAi2Z2N4hOThl4Zl',
      links: [{ label: 'Instagram', url: 'https://www.instagram.com/paulineaggerholm/' }],
    },
    {
      slug: 'baske', name: 'BASKE', color: '#F5DB36',
      description: {
        da: 'Duoen Aske Bramming og Sebastian Woll forener melodisk indiepop med fortællinger om venskab, tvivl, fællesskab og modstand.',
        en: 'The duo Aske Bramming and Sebastian Woll pair melodic indie pop with stories of friendship, doubt, community and resistance.',
      },
      achievements: [{ da: 'Efter en udsolgt koncert på Ideal Bar vender BASKE tilbage til VEGA med en koncert i Lille VEGA i november 2026.', en: 'After a sold-out Ideal Bar show, BASKE return to VEGA for a Lille VEGA concert in November 2026.' }],
      imageUrl: '/images/baske.webp',
      imageAlt: { da: 'Aske Bramming og Sebastian Woll fra BASKE', en: 'Aske Bramming and Sebastian Woll of BASKE' },
      imageCredit: 'Phie Beckett Stenbæk',
      spotifyArtistUrl: 'https://open.spotify.com/artist/5t1bsUlFWixhgRJ983muoP',
      links: [{ label: 'Instagram', url: 'https://www.instagram.com/baske/' }],
    },
    {
      slug: 'spleen-united', name: 'Spleen United', color: '#F8F1E8',
      description: {
        da: 'Spleen United har i to årtier skabt deres eget møde mellem elektronisk musik og rock og i det har defineret deres egen genre. Bandet fortsætter med at udvikle lyden og livet omkring den.',
        en: 'For two decades, Spleen United have shaped their own meeting of electronic music and rock, defining a genre of their own. The band continues to develop the sound and the life around it.',
      },
      achievements: [{ da: 'Markerede 20-årsjubilæet for Godspeed Into The Mainstream med tre koncertaftener i Store VEGA i december 2025.', en: 'Marked the 20th anniversary of Godspeed Into The Mainstream with three nights at Store VEGA in December 2025.' }],
      imageUrl: '/images/spleen-united.webp',
      imageAlt: { da: 'Spleen United, pressefoto', en: 'Spleen United, press photo' },
      imageCredit: 'Rasmus Weng Carlsen',
      spotifyArtistUrl: 'https://open.spotify.com/artist/1qBqsr5kuSRxPn13aE8fnY',
      links: [{ label: 'Instagram', url: 'https://www.instagram.com/spleenunited/' }, { label: 'Musik og sociale medier', url: 'https://linktr.ee/Spleenunited' }],
    },
  ],
};

export type SanityImage = { _type?: 'image'; asset?: { _ref?: string; url?: string }; crop?: { top: number; bottom: number; left: number; right: number }; hotspot?: { x: number; y: number; width: number; height: number }; alt?: Localized; credit?: string };
type AssetFile = { asset?: { url?: string } };
export type RawArtist = Omit<Artist, 'links'> & { _id: string; visible?: boolean; displayOrder?: number; image?: SanityImage; heroImage?: SanityImage; links?: ArtistLink[]; socialProfiles?: ArtistLink[] };
export type RawContent = { settings?: Partial<Omit<SiteContent, 'artists' | 'source' | 'privacy' | 'brand' | 'footer' | 'seo'>> & { brand?: Partial<Omit<Brand, 'logo'|'mark'|'tickerMark'|'favicon'>> & {logo?: AssetFile;mark?: AssetFile;tickerMark?: AssetFile;favicon?: AssetFile}; footer?: Partial<Omit<Footer,'creditLogo'>> & {creditLogo?:AssetFile}; seo?: Partial<Omit<SiteContent['seo'],'sharingImage'>> & {sharingImage?:SanityImage} }; privacy?: Partial<Privacy>; artists?: RawArtist[] };

export const SITE_CONTENT_QUERY = defineQuery(`{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
    intro,contactTitle,contactEmail,contactPhone,text,
    brand{...,logo{asset->{url}},mark{asset->{url}},tickerMark{asset->{url}},favicon{asset->{url}}},
    footer{...,creditLogo{asset->{url}}},seo{...,sharingImage{...,asset->{url}}}
  },
  "privacy": *[_type == "privacyPage" && _id == "privacyPage"][0]{title,seoTitle,description,sections},
  "artists": *[_type == "artist" && visible == true] | order(displayOrder asc, name asc){
    _id,name,"slug":slug.current,description,achievements,spotifyArtistUrl,spotifyEmbedVisible,color,card,
    links[]{_key,label,url},socialProfiles[]{_key,label,url,platform,showOnCard,showInDetails},
    image{...,asset->{url}},heroImage{...,asset->{url}}
  }
}`);

export function copy(content: SiteContent, key: UITextKey, locale: Locale): string {
  return localized(content.text[key], locale);
}
export function linkLabel(link: ArtistLink, locale: Locale): string {
  return typeof link.label === 'string' ? link.label : localized(link.label, locale);
}
export function safeHttps(url: string | undefined): boolean {
  try { return Boolean(url && new URL(url).protocol === 'https:'); } catch { return false; }
}

function omitNulls(value: unknown): unknown {
  if (value === null) return undefined;
  if (Array.isArray(value)) return value.map(omitNulls);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([,v])=>v!==null).map(([k,v])=>[k,omitNulls(v)]));
  return value;
}

export function normalizeContent(input: RawContent | SITE_CONTENT_QUERY_RESULT, projectId: string, dataset: string): SiteContent {
  // GROQ emits null for missing projections; the normalizer treats them as optional fields.
  const raw = omitNulls(input) as RawContent;
  const settings = raw.settings || {};
  const brand = settings.brand || {};
  const footer = settings.footer || {};
  const builder = createImageUrlBuilder({ projectId, dataset });
  const imageUrl = (image: SanityImage | undefined, width: number, height: number) => {
    if (!image?.asset?.url && !image?.asset?._ref) return undefined;
    try { return builder.image(image).width(width).height(height).fit('crop').auto('format').url(); } catch { return undefined; }
  };
  const text = Object.fromEntries(Object.entries(defaultText).map(([key,value]) => [key, settings.text?.[key as UITextKey] || value])) as SiteContent['text'];
  return {
    source: 'sanity', text,
    intro: settings.intro || previewContent.intro,
    contactTitle: settings.contactTitle || previewContent.contactTitle,
    contactEmail: settings.contactEmail || previewContent.contactEmail,
    contactPhone: settings.contactPhone || previewContent.contactPhone,
    brand: { ...defaultBrand, ...brand, logo: brand.logo?.asset?.url || defaultBrand.logo, mark: brand.mark?.asset?.url || defaultBrand.mark, tickerMark: brand.tickerMark?.asset?.url || defaultBrand.tickerMark, favicon: brand.favicon?.asset?.url || defaultBrand.favicon },
    footer: { ...defaultFooter, ...footer, creditLogo: footer.creditLogo?.asset?.url || defaultFooter.creditLogo },
    seo: { ...defaultSeo, ...settings.seo, sharingImage: imageUrl(settings.seo?.sharingImage,1200,630) || '', sharingImageAlt:settings.seo?.sharingImage?.alt || defaultSeo.sharingImageAlt },
    privacy: { ...defaultPrivacy, ...raw.privacy, sections: raw.privacy?.sections || defaultPrivacy.sections },
    artists: (raw.artists || []).filter(a => a.slug && a.name).map(a => ({
      slug:a.slug,name:a.name,description:a.description,achievements:a.achievements || [],color:a.color || '#DF597D',
      spotifyArtistUrl:safeHttps(a.spotifyArtistUrl) ? a.spotifyArtistUrl : undefined,spotifyEmbedVisible:a.spotifyEmbedVisible,card:a.card,
      imageUrl:imageUrl(a.image,1200,1200),thumbImageUrl:imageUrl(a.image,160,160),heroImageUrl:imageUrl(a.heroImage || a.image,720,1080),
      imageAlt:a.image?.alt,imageCredit:a.image?.credit,heroImageAlt:(a.heroImage || a.image)?.alt,
      links:(a.socialProfiles ?? a.links ?? []).filter(l => safeHttps(l.url)).map(l => ({...l,label:l.label || l.platform || 'Link'})),
    })),
  };
}
