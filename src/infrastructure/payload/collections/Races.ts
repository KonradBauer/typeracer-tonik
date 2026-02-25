import type { CollectionConfig } from 'payload'

export const Races: CollectionConfig = {
  slug: 'races',
  admin: {
    useAsTitle: 'status',
    defaultColumns: ['status', 'createdBy', 'text', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'waiting',
      options: [
        { label: 'Waiting', value: 'waiting' },
        { label: 'Countdown', value: 'countdown' },
        { label: 'Racing', value: 'racing' },
        { label: 'Finished', value: 'finished' },
      ],
    },
    {
      name: 'text',
      type: 'relationship',
      relationTo: 'texts',
      required: true,
    },
    {
      name: 'config',
      type: 'group',
      fields: [
        {
          name: 'maxPlayers',
          type: 'number',
          defaultValue: 4,
          min: 2,
          max: 8,
        },
        {
          name: 'countdownSeconds',
          type: 'number',
          defaultValue: 5,
          min: 3,
          max: 10,
        },
      ],
    },
    {
      name: 'startedAt',
      type: 'date',
    },
    {
      name: 'finishedAt',
      type: 'date',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
}
