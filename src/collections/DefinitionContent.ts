import { CollectionConfig } from 'payload';

export const DefinitionContent: CollectionConfig = {
  slug: 'definition-content',
  admin: {
    useAsTitle: 'termID',
    description: 'Unique Definition ID, may define multiple terms',
  },
  access: {
    read: () => true,
    create: () => true, // these can be uncommented for upload testing, major security risk if used in a live server
    update: () => true,
  },
  fields: [
    {
      name: 'termID',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Term ID from spreadsheet (e.g. "ABUT or ABUTTING", "DWELLING, SINGLE DETACHED (Single Detached Dwelling)")',
      },
    },
    {
      name: 'text',
      type: 'richText', // changed from textarea, removed html conversion happens in beforeChange hook
      required: true,
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'string') {
              // Strip HTML tags and convert to Lexical JSON structure
              const cleanText = value.replace(/<[^>]*>/g, '');
              return {
                root: {
                  type: 'root',
                  format: '',
                  indent: 0,
                  version: 1,
                  children: [
                    {
                      type: 'paragraph',
                      format: '',
                      indent: 0,
                      version: 1,
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: cleanText,
                          type: 'text',
                          version: 1,
                        },
                      ],
                    },
                  ],
                },
              };
            }
            return value;
          },
        ],
      },
      admin: {
        description: 'Definition text from spreadsheet',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'General', value: 'General' },
        { label: 'Use', value: 'Use' },
        { label: 'General / Use', value: 'General / Use' },
      ],
      admin: {
        description: 'Definition type from spreadsheet',
      },
    },
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Optional images associated with this definition',
      },
    },
  ],
};
