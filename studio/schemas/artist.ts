import { defineField, defineType } from 'sanity';

export const artist = defineType({
  name: 'artist', title: 'Artist', type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Artist name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL ID', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'visible', title: 'Show on website', type: 'boolean', initialValue: true, description: 'Turn off to hide without deleting.' }),
    defineField({ name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100, validation: (Rule) => Rule.integer().min(0) }),
    defineField({ name: 'color', title: 'Background colour', type: 'string', initialValue: '#DF597D', options: { list: [
      { title: 'Mellow pink', value: '#DF597D' }, { title: 'Electric blue', value: '#254BCC' },
      { title: 'Deep green', value: '#215946' }, { title: 'Poster yellow', value: '#F5DB36' },
      { title: 'Warm paper', value: '#F8F1E8' },
    ] } }),
    defineField({ name: 'image', title: 'Artist photo', type: 'image', options: { hotspot: true }, fields: [
      defineField({ name: 'alt', title: 'Image description', type: 'localizedText', validation: (Rule) => Rule.required() }),
      defineField({ name: 'credit', title: 'Photographer credit', type: 'string' }),
      defineField({ name: 'rightsNote', title: 'Usage / crop notes (internal)', type: 'text', rows: 2 }),
    ] }),
    defineField({ name: 'description', title: 'Short description', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'achievements', title: 'Achievements / highlights', type: 'array', of: [{ type: 'localizedText' }] }),
    defineField({ name: 'links', title: 'Social, music and website links', type: 'array', of: [{ type: 'externalLink' }] }),
    defineField({ name: 'spotifyArtistUrl', title: 'Spotify artist URL', type: 'url', description: 'Paste the artist profile URL. Spotify decides which songs appear in its player.', validation: (Rule) => Rule.uri({ scheme: ['https'] }).custom((value) => !value || /^https:\/\/open\.spotify\.com\/artist\/[A-Za-z0-9]+\/?(?:\?.*)?$/.test(value) || 'Use a Spotify artist profile link.') }),
  ],
  orderings: [{ title: 'Website order', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', media: 'image', visible: 'visible' }, prepare: ({ title, media, visible }) => ({ title, media, subtitle: visible ? 'Visible' : 'Hidden' }) },
});
