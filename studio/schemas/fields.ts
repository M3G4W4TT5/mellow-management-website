import { defineField, defineType } from 'sanity';

export const localizedText = defineType({
  name: 'localizedText', title: 'Danish / English text', type: 'object',
  fields: [
    defineField({ name: 'da', title: 'Dansk', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3 }),
  ],
});

export const externalLink = defineType({
  name: 'externalLink', title: 'External link', type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required().uri({ scheme: ['https'] }) }),
  ],
  preview: { select: { title: 'label', subtitle: 'url' } },
});
