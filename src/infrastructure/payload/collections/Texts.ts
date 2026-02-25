import type { CollectionConfig } from 'payload'

export const Texts: CollectionConfig = {
  slug: 'texts',
  admin: {
    useAsTitle: 'source',
    defaultColumns: ['source', 'author', 'difficulty', 'wordCount'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Book title, quote attribution, etc.',
      },
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'difficulty',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
    },
    {
      name: 'wordCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'charCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'language',
      type: 'text',
      defaultValue: 'en',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.content) {
          const trimmed = data.content.trim()
          data.wordCount = trimmed.split(/\s+/).length
          data.charCount = trimmed.length
        }
        return data
      },
    ],
  },
}
