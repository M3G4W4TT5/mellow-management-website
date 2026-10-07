import type { Artist } from './content-model';
import type { SocialPlatform } from '../components/SocialIcon';

export function socialLinks(artist: Artist): { platform: SocialPlatform; url: string }[] {
  const candidates = [
    ...(artist.spotifyArtistUrl && artist.card?.showSpotify !== false ? [{ url: artist.spotifyArtistUrl, platform: 'Spotify' as SocialPlatform }] : []),
    ...artist.links.filter(link => link.showOnCard !== false),
  ];
  const links: {platform:SocialPlatform;url:string}[]=[];
  const seen = new Set<string>();
  for (const link of candidates) {
    try {
      const url = new URL(link.url);
      if (url.protocol !== 'https:') continue;
      const host = url.hostname.replace(/^www\./, '');
      const platform = link.platform || (host === 'open.spotify.com' ? 'Spotify'
        : host === 'instagram.com' ? 'Instagram'
        : host === 'facebook.com' || host === 'm.facebook.com' ? 'Facebook' : undefined);
      if (platform && !seen.has(platform==='Website'?link.url:platform)) {
        seen.add(platform==='Website'?link.url:platform); links.push({platform,url:link.url});
      }
    } catch { /* Invalid editorial links do not become clickable icons. */ }
  }
  return links;
}
