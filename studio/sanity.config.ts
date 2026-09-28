import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';

export default defineConfig({
  name: 'mellow-management',
  title: 'Mellow Management',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({
    structure: (S) => S.list().title('Website content').items([
      S.listItem().title('Site text & contact').id('siteSettings').child(
        S.document().schemaType('siteSettings').documentId('siteSettings')
      ),
      S.divider(),
      S.documentTypeListItem('artist').title('Artists'),
    ]),
  })],
  schema: { types: schemaTypes },
});
