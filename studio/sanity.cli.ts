import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  deployment: { appId: 'vrozx9vrmwbl89sbqwyxw8t8' },
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
});
