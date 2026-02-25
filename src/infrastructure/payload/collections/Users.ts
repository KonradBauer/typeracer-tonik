import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'username',
  },
  auth: true,
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      minLength: 3,
      maxLength: 24,
    },
    {
      name: 'displayName',
      type: 'text',
      maxLength: 48,
    },
    {
      name: 'avatarUrl',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'player',
      options: [
        { label: 'Player', value: 'player' },
        { label: 'Admin', value: 'admin' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'totalRaces',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'avgWpm',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'bestWpm',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'avgAccuracy',
          type: 'number',
          defaultValue: 0,
          admin: { readOnly: true },
        },
        {
          name: 'elo',
          type: 'number',
          defaultValue: 1000,
          admin: { readOnly: true },
        },
      ],
    },
  ],
}
