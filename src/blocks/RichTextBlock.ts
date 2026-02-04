import { defaultLexical } from '@/fields/defaultLexical';
import { Block } from 'payload';

// blocks/RichTextBlock.ts
export const RichTextBlock = {
  slug: 'richText',
  fields: [
    { name: 'body', type: 'richText', editor: defaultLexical, required: true }, // Lexical :contentReference[oaicite:8]{index=8}
  ],
} as const satisfies Block;
