import { CollectionConfig } from 'payload'

export const Definitions: CollectionConfig = {
  slug: 'definitions',
  labels: {
    singular: 'Definition',
    plural: 'Definitions',
  },
  admin: {
    useAsTitle: 'term',
    description: 'Defined terms used in bylaws and policies',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Exact term spelling (e.g. Abut, Abutting)',
      },
    },
    {
      name: 'definitionContent',
      type: 'relationship',
      relationTo: 'definition-content',
      required: true,
      admin: {
        description: 'Points to the canonical definition',
      },
    },
  ],
}
