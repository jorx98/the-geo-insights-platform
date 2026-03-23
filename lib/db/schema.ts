import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const workspaces = sqliteTable('workspaces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const brands = sqliteTable('brands', {
  id: text('id').primaryKey(),
  workspaceId: text('workspace_id').notNull().references(() => workspaces.id),
  name: text('name').notNull(),
  domain: text('domain'),
  keywords: text('keywords', { mode: 'json' }).$type<string[]>(),
  language: text('language').default('en'),
  country: text('country').default('Global'),
  product: text('product'),
  service: text('service'),
});

export const geoScans = sqliteTable('geo_scans', {
  id: text('id').primaryKey(),
  brandId: text('brand_id').notNull().references(() => brands.id, { onDelete: 'cascade' }),
  modelName: text('model_name').notNull(),
  promptUsed: text('prompt_used').notNull(),
  rawResponse: text('raw_response'),
  status: text('status').notNull(),
  report: text('report', { mode: 'json' }), // Structured analysis
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const metrics = sqliteTable('metrics', {
  id: text('id').primaryKey(),
  scanId: text('scan_id').notNull().references(() => geoScans.id, { onDelete: 'cascade' }),
  rank: integer('rank'),
  sentiment: real('sentiment'),
  isRecommended: integer('is_recommended', { mode: 'boolean' }),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});
