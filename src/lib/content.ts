import { createClient } from '@sanity/client';

export type Locale = 'da' | 'en';
export type Localized = { da: string; en?: string };
export type Artist = {
  slug: string;
  name: string;
  description: Localized;
  achievements: Localized[];
  imageUrl?: string;
  imageAlt?: Localized;
  imageCredit?: string;
  spotifyArtistUrl?: string;
  links: { label: string; url: string }[];
  color: string;
};
export type SiteContent = {
  intro: Localized;
  contactTitle: Localized;
  contactText: Localized;
  contactEmail: string;
  artists: Artist[];
  source: 'sanity' | 'preview';
};

export function localized(value: Localized | undefined, locale: Locale): string {
  return value?.[locale] || value?.da || '';
}

export const previewContent: SiteContent = {
  source: 'preview',
  intro: {
    da: 'God musik skabes af mennesker med noget på hjerte. Mellow Management arbejder med danske artister, der har deres egen lyd og sætter musikken og kunsten først.',
    en: 'Great music comes from people with something to say. Mellow Management works with Danish artists who have their own sound and put music and art first.',
  },
  contactTitle: { da: 'Lad os tale musik.', en: 'Let’s talk music.' },
  contactText: {
    da: 'For henvendelser om artisterne eller Mellow Management:',
    en: 'For enquiries about the artists or Mellow Management:',
  },
  contactEmail: 'john@mellowmanagement.com',
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
      links: [],
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
      links: [],
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
      links: [],
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
      links: [{ label: 'Musik og sociale medier', url: 'https://linktr.ee/Spleenunited' }],
    },
  ],
};

type SanityArtist = Omit<Artist, 'imageUrl' | 'color'> & {
  image?: { assetUrl?: string; alt?: Localized; credit?: string };
  color?: string;
};

const contentQuery = `{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{intro, contactTitle, contactText, contactEmail},
  "artists": *[_type == "artist" && visible == true] | order(displayOrder asc, name asc){
    "slug": slug.current, name, description, achievements, spotifyArtistUrl,
    links[]{label, url}, color,
    "image": {"assetUrl": image.asset->url, "alt": image.alt, "credit": image.credit}
  }
}`;

export async function getContent(): Promise<SiteContent> {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return previewContent;

  const client = createClient({
    projectId,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-09-01',
    useCdn: false,
  });
  const result = await client.fetch<{
    settings?: Partial<Omit<SiteContent, 'artists' | 'source'>>;
    artists?: SanityArtist[];
  }>(contentQuery);

  return {
    intro: result.settings?.intro || previewContent.intro,
    contactTitle: result.settings?.contactTitle || previewContent.contactTitle,
    contactText: result.settings?.contactText || previewContent.contactText,
    contactEmail: result.settings?.contactEmail || previewContent.contactEmail,
    source: 'sanity',
    artists: (result.artists || []).filter((artist) => artist.slug && artist.name).map((artist) => ({
      ...artist,
      achievements: artist.achievements || [],
      links: (artist.links || []).filter((link) => /^https:\/\//.test(link.url)),
      imageUrl: artist.image?.assetUrl,
      imageAlt: artist.image?.alt,
      imageCredit: artist.image?.credit,
      color: artist.color || '#DF597D',
    })),
  };
}
