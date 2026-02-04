import { ImageBlock } from '@/blocks/ImageBlock'
import { ListBlock } from '@/blocks/ListBlock'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { TableBlock } from '@/blocks/TableBlock'
import type { CollectionConfig } from 'payload'

export const BylawSections: CollectionConfig = {
  access: {
    read: () => true, // allow anyone to read
    // you can leave create/update/delete as default (probably restricted)
  },
  slug: 'bylawSections',
  admin: { useAsTitle: 'label' },
  fields: [
    {
      name: 'bylaw',
      type: 'relationship',
      relationTo: 'bylaws',
      required: true,
      index: true,
    }, // relationship fields relate documents :contentReference[oaicite:4]{index=4}

    // "Part C", "C.1", "(a)"", etc
    { name: 'code', type: 'text', required: true }, // e.g. "C", "C.1", "C.1.1"
    { name: 'title', type: 'text' }, // e.g. "General Regulations"
    { name: 'label', type: 'text', required: true }, // e.g. "C.1 General Regulations"

    { name: 'sortKey', type: 'text', index: true, admin: { hidden: true } },

    // Deep-link target
    { name: 'slug', type: 'text', required: true, index: true },

    // Main body content (next step)
    {
      name: 'content',
      type: 'blocks',
      blocks: [RichTextBlock, TableBlock, ListBlock, ImageBlock],
    }, // blocks field = flexible content builder :contentReference[oaicite:5]{index=5}
  ],
  versions: { drafts: true },
}
