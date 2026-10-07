import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site text & contact', type: 'document',
  fields: [
    defineField({ name: 'intro', title: 'Introduction', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'contactTitle', title: 'Contact heading', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'contactText', title: 'Contact text', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'contactPhone', title: 'Public contact phone', type: 'string', description: 'Include country code, e.g. +45 51 88 12 34.' }),
    defineField({ name: 'contactEmail', title: 'Public contact email', type: 'email', validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: 'Site text & contact' }) },
});
