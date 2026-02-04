import { Block } from 'payload'

export const ListBlock = {
  slug: 'list',
  fields: [
    { name: 'kind', type: 'select', options: ['ordered', 'unordered'], required: true },
    { name: 'items', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
  ],
} as const satisfies Block
