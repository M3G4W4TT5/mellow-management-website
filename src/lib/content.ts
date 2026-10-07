import { createClient } from '@sanity/client';
import { normalizeContent, previewContent, SITE_CONTENT_QUERY, type SiteContent } from './content-model';
import type {SITE_CONTENT_QUERY_RESULT} from './sanity.types';
export * from './content-model';

export async function getContent(): Promise<SiteContent> {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return previewContent;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
  const client = createClient({ projectId, dataset, apiVersion: '2026-09-01', useCdn: false, perspective: 'published' });
  return normalizeContent(await client.fetch<SITE_CONTENT_QUERY_RESULT>(SITE_CONTENT_QUERY), projectId, dataset);
}
