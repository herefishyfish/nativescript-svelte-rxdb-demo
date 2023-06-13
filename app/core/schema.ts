export const heroSchema = {
  title: 'hero schema',
  description: 'describes a simple hero',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
      maxLength: 100,
    },
    color: {
      type: 'string',
      maxLength: 30,
    },
    createdAt: {
      type: 'string',
      maxLength: 24,
    },
    updatedAt: {
      type: 'string',
      maxLength: 24,
    },
  },
  indexes: ['name', 'color', 'updatedAt', 'createdAt'],
  required: ['id', 'name'],
};
