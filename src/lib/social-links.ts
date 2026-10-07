import type { Artist } from './content';
import type { SocialPlatform } from '../components/SocialIcon';

export function socialLinks(artist: Artist): { platform: SocialPlatform; url: string }[] {
  const candidates = [
    ...(artist.spotifyArtistUrl ? [{ url: artist.spotifyArtistUrl }] : []),
    ...artist.links,
  ];
  const links = new Map<SocialPlatform, string>();
  for (const link of candidates) {
    try {
      const url = new URL(link.url);
      if (url.protocol !== 'https:') continue;
      const host = url.hostname.replace(/^www\./, '');
      const platform = host === 'open.spotify.com' ? 'Spotify'
        : host === 'instagram.com' ? 'Instagram'
        : host === 'facebook.com' || host === 'm.facebook.com' ? 'Facebook' : undefined;
      if (platform && !links.has(platform)) links.set(platform, link.url);
    } catch { /* Invalid editorial links do not become clickable icons. */ }
  }
  return (['Spotify', 'Instagram', 'Facebook'] as const).flatMap((platform) => {
    const url = links.get(platform);
    return url ? [{ platform, url }] : [];
  });
}
