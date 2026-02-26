import type { CollectionConfig } from 'payload'

export const RaceParticipants: CollectionConfig = {
  slug: 'race-participants',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['race', 'player', 'position', 'wpm', 'finished'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'race',
      type: 'relationship',
      relationTo: 'races',
      required: true,
      index: true,
    },
    {
      name: 'player',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },
    {
      name: 'position',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'wpm',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'accuracy',
      type: 'number',
      defaultValue: 100,
      min: 0,
      max: 100,
    },
    {
      name: 'finished',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'finishedAt',
      type: 'date',
    },
    {
      name: 'joinedAt',
      type: 'date',
      required: true,
    },
  ],
}
