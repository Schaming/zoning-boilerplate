import { defaultLexical } from '@/fields/defaultLexical';
import { Block } from 'payload';

export const TableBlock = {
  slug: 'table',
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
      admin: {
        description:
          'Optional title / caption, e.g. "Table 4 | R-1 District Building Setbacks and Heights"',
      },
    },
    {
      name: 'titleRich',
      type: 'richText',
      editor: defaultLexical,
      required: false,
      admin: {
        description: 'Rich-text title / caption for this table (use this going forward).',
      },
    },
    {
      name: 'footer',
      type: 'richText',
      editor: defaultLexical,
      required: false,
      admin: {
        description: 'Optional footer / notes for this table (e.g. "* See B.2.9.1 [e]").',
      },
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'grid',
      options: ['grid', 'gridStriped', 'plain'],
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'cells',
          type: 'array',
          fields: [
            { name: 'text', type: 'text' },
            { name: 'isHeader', type: 'checkbox' },
            {
              name: 'colSpan',
              type: 'number',
              defaultValue: 1,
              min: 1,
              max: 24,
              admin: {
                description: 'Number of columns this cell spans (e.g. 5 for a section header row).',
              },
            },

            {
              name: 'body',
              type: 'richText',
              editor: defaultLexical,
              admin: {
                description: 'Rich text for this cell (links, bold, etc.)',
              },
            },
            {
              name: 'className',
              type: 'text',
              required: false,
              admin: {
                description:
                  'Optional CSS/Tailwind classes for this cell (e.g. "text-xs text-gray-500").',
              },
            },
          ],
        },
      ],
    },
  ],
} as const satisfies Block;
