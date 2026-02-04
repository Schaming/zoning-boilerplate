import type { CollectionConfig } from 'payload'

export const Bylaws: CollectionConfig = {
  slug: 'bylaws',

  admin: { useAsTitle: 'title' },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'jurisdiction', type: 'text' },
    { name: 'effectiveDate', type: 'date' },
    { name: 'sourcePDF', type: 'upload', relationTo: 'media' }, // optional
    { name: 'sortKey', type: 'text', index: true, admin: { hidden: true } },
  ],
  versions: { drafts: true }, // optional but recommended for rollback
}
