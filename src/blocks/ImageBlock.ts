import { Block } from 'payload'

export const ImageBlock = {
  slug: 'image',
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true }, // :contentReference[oaicite:10]{index=10}
    { name: 'caption', type: 'text' },
    { name: 'align', type: 'select', options: ['left', 'center', 'right'] },
  ],
} as const satisfies Block
