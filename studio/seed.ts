import { createReadStream } from 'node:fs';
import { getCliClient } from 'sanity/cli';
import { previewContent } from '../src/lib/content';

// Run once with: cd studio && sanity exec seed.ts --with-user-token
// Existing documents are deliberately left untouched, so rerunning is safe for John's edits.
const client = getCliClient({ apiVersion: '2026-09-01' });
const asLocalized = (value: { da: string; en?: string } | undefined) => value && ({ _type: 'localizedText', ...value });

const settings = await client.getDocument('siteSettings');
if (!settings) {
  await client.create({
    _id: 'siteSettings', _type: 'siteSettings',
    intro: asLocalized(previewContent.intro),
    contactTitle: asLocalized(previewContent.contactTitle),
    contactEmail: previewContent.contactEmail,
    contactPhone: previewContent.contactPhone,
  });
  console.log('Created site settings');
}

for (const [index, artist] of previewContent.artists.entries()) {
  const id = `artist-${artist.slug}`;
  if (await client.getDocument(id)) { console.log(`Kept existing ${artist.name}`); continue; }
  const file = new URL(`../public/images/${artist.slug}.webp`, import.meta.url);
  const asset = await client.assets.upload('image', createReadStream(file), { filename: `${artist.slug}.webp` });
  await client.create({
    _id: id, _type: 'artist', name: artist.name, slug: { _type: 'slug', current: artist.slug },
    visible: true, displayOrder: (index + 1) * 10, color: artist.color,
    image: {
      _type: 'image', asset: { _type: 'reference', _ref: asset._id },
      alt: asLocalized(artist.imageAlt), credit: artist.imageCredit,
      rightsNote: 'Cleared for Mellow website use by project owner, 28 September 2026.',
    },
    description: asLocalized(artist.description),
    achievements: artist.achievements.map((item, n) => ({ _type: 'localizedText', _key: `highlight-${n}`, ...item })),
    links: artist.links.map((link, n) => ({ _type: 'externalLink', _key: `link-${n}`, ...link })),
    spotifyArtistUrl: artist.spotifyArtistUrl,
  });
  console.log(`Created ${artist.name}`);
}

console.log('Seed complete. Existing artist and site documents were not replaced.');
