import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import {schemaTypes} from './schemas';
import WebsitePreview from './WebsitePreview';

export default defineConfig({
  name: 'mellow-management',
  title: 'Mellow Management',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({
    defaultDocumentNode:(S)=>S.document().views([S.view.form(),S.view.component(WebsitePreview).title('Preview')]),
    structure: (S) => S.list().title('Website content').items([
      S.listItem().title('Site text & contact').id('siteSettings').child(
        S.document().schemaType('siteSettings').documentId('siteSettings').views([S.view.form(),S.view.component(WebsitePreview).title('Preview')])
      ),
      S.listItem().title('Privacy page').id('privacyPage').child(S.document().schemaType('privacyPage').documentId('privacyPage').views([S.view.form(),S.view.component(WebsitePreview).title('Preview')])),
      S.divider(),
      S.documentTypeListItem('artist').title('Artists'),
    ]),
  })],
  document:{newDocumentOptions:prev=>prev.filter(item=>!['siteSettings','privacyPage'].includes(item.templateId)),actions:(prev,context)=>['siteSettings','privacyPage'].includes(context.schemaType)?prev.filter(action=>action.action && ['publish','discardChanges','restore'].includes(action.action)):prev},
  schema: { types: schemaTypes },
});
