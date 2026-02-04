import type { CollectionConfig } from 'payload'

export const Amendments: CollectionConfig = {
  slug: 'amendments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'year'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'amendmentId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier for linking (e.g., "2024-123")',
      },
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., "By-law 2024-123 - Residential Setback Changes"',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
  ],
  versions: { drafts: true },
}
