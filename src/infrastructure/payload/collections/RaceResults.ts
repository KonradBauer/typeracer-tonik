import type { CollectionConfig } from 'payload'
import { updateUserStatsAfterResult } from '@/infrastructure/payload/hooks/update-user-stats'

export const RaceResults: CollectionConfig = {
  slug: 'race-results',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['race', 'player', 'position', 'wpm', 'accuracy'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [updateUserStatsAfterResult],
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
      required: true,
      min: 1,
    },
    {
      name: 'wpm',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'accuracy',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
    },
    {
      name: 'consistency',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'finishedAt',
      type: 'date',
    },
    {
      name: 'keystrokes',
      type: 'json',
      admin: {
        description: 'Raw keystroke data for replay (optional)',
      },
    },
  ],
}
