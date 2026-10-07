import { defineArrayMember, defineField, defineType } from 'sanity';
import { artistImage } from './content';

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
    artistImage('image','Artist photo — browser & thumbnails'),
    artistImage('heroImage','Optional hero photo — uses artist photo when empty'),
    defineField({name:'card',title:'Hero card back',type:'cardContent'}),
    defineField({name:'socialProfiles',title:'Public social & website profiles',description:'Drag to reorder icons and links. Only add public artist profiles. Spotify is managed by the Spotify artist URL below.',type:'array',of:[defineArrayMember({type:'socialProfile'})],validation:Rule=>Rule.custom(value=>!value || new Set((value as {platform?:string}[]).filter(p=>p.platform!=='Website').map(p=>p.platform)).size===(value as {platform?:string}[]).filter(p=>p.platform!=='Website').length || 'Add each social platform only once.')}),
    defineField({name:'spotifyEmbedVisible',title:'Show Spotify player in artist details',type:'boolean',initialValue:true}),
    defineField({ name: 'description', title: 'Short description', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'achievements', title: 'Achievements / highlights', type: 'array', of: [defineArrayMember({ type: 'localizedText' })] }),
    defineField({ name: 'links', title: 'Legacy links (retired)', type: 'array', of: [defineArrayMember({ type: 'externalLink' })], deprecated:{reason:'Use Public social & website profiles instead. Existing links are retained for reference.'}, readOnly:true,hidden:({value})=>value===undefined }),
    defineField({ name: 'spotifyArtistUrl', title: 'Spotify artist URL', type: 'url', description: 'Paste the artist profile URL. Spotify decides which songs appear in its player.', validation: (Rule) => Rule.uri({ scheme: ['https'] }).custom((value) => !value || /^https:\/\/open\.spotify\.com\/artist\/[A-Za-z0-9]+\/?(?:\?.*)?$/.test(value) || 'Use a Spotify artist profile link.') }),
  ],
  orderings: [{ title: 'Website order', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', media: 'image', visible: 'visible' }, prepare: ({ title, media, visible }) => ({ title, media, subtitle: visible ? 'Visible' : 'Hidden' }) },
});
