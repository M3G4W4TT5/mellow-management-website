import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings', title: 'Site text & contact', type: 'document',
  groups: [{name:'text',title:'Page text',default:true},{name:'contact',title:'Contact'},{name:'brand',title:'Brand & logos'},{name:'footer',title:'Footer & company'},{name:'seo',title:'Search & sharing'}],
  fields: [
    defineField({name:'text',title:'Shared labels & headings',type:'interfaceText',group:'text'}),
    defineField({name:'brand',title:'Brand & logos',type:'brandSettings',group:'brand'}),
    defineField({name:'footer',title:'Footer & company',type:'footerSettings',group:'footer'}),
    defineField({name:'seo',title:'Search & sharing',type:'seoSettings',group:'seo'}),
    defineField({ name: 'intro', group:'text', title: 'Introduction', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'contactTitle', group:'contact', title: 'Contact heading', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'contactText', title: 'Contact text (retired)', type: 'localizedText',
      deprecated: { reason: 'The contact introduction has been removed from the website. Existing text is retained for reference.' },
      readOnly: true, hidden: ({ value }) => value === undefined,
    }),
    defineField({ name: 'contactPhone', group:'contact', title: 'Public contact phone', type: 'string', description: 'Include country code, e.g. +45 51 88 12 34.' }),
    defineField({ name: 'contactEmail', group:'contact', title: 'Public contact email', type: 'email', validation: (Rule) => Rule.required() }),
  ],
  preview: { prepare: () => ({ title: 'Site text & contact' }) },
});
