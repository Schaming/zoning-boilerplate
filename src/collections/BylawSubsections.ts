import { ImageBlock } from '@/blocks/ImageBlock'
import { ListBlock } from '@/blocks/ListBlock'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { TableBlock } from '@/blocks/TableBlock'
import type { CollectionConfig } from 'payload'

export const BylawSubsections: CollectionConfig = {
  access: {
    read: () => true, // allow anyone to read
    // you can leave create/update/delete as default (probably restricted)
  },
  slug: 'bylawSubsections',
  admin: { useAsTitle: 'label' },
  fields: [
    {
      name: 'section',
      type: 'relationship',
      relationTo: 'bylawSections',
      required: true,
      index: true,
    },

    // e.g. "B.2.1", "B.2.2"
    { name: 'code', type: 'text', required: true },

    // Optional: explicit depth, easier for sorting/indent
    {
      name: 'level',
      type: 'number',
      admin: {
        description: 'Depth under section: 1 for B.2.1, 2 for B.2.1.1, etc.',
      },
    },

    // Optional: parent link inside the same collection for B.2.1.1 -> B.2.1
    {
      name: 'parentSubsection',
      type: 'relationship',
      relationTo: 'bylawSubsections',
      required: false,
      admin: {
        description: 'If this is B.2.1.1, parent is B.2.1',
      },
    },

    // more human friendly
    { name: 'title', type: 'text' }, // "Purpose", "Uses"
    { name: 'label', type: 'text', required: true }, // "B.2.1 Purpose"
    { name: 'slug', type: 'text', required: true, index: true },

    // optional sort field if code ordering isn't enough
    {
      name: 'sortOrder',
      type: 'number',
      admin: { description: 'Order within the parent section (1, 2, 3...)' },
    },

    {
      name: 'content',
      type: 'blocks',
      blocks: [RichTextBlock, TableBlock, ListBlock, ImageBlock],
    },

    {
      name: 'amendments',
      type: 'relationship',
      relationTo: 'amendments',
      hasMany: true,
      admin: {
        description: 'Amendments that affect this subsection',
      },
    },
  ],
  versions: { drafts: true },
}
