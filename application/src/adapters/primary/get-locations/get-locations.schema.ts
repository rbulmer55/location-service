export const schema = {
  $id: 'https://example.com/locationAPI.json',
  type: 'object',
  maxProperties: 10, // TODO - amend base schema
  minProperties: 0,
  properties: {
    construction: {
      type: 'string',
      enum: ['wood', 'concrete', 'stone', 'brick'],
    },
    buildingCat: {
      type: 'string',
      enum: ['household', 'business', 'government'],
    },
    metadata: {
      type: 'object',
      properties: {
        pageSize: { type: 'number' },
        lastDocument: { type: 'string' },
        sortOrder: { type: 'object' },
      },
    },
  },
};
