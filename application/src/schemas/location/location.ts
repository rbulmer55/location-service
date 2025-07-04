export const schema = {
  $id: 'https://example.com/location.json',
  type: 'object',
  required: ['name', 'address', 'occupancy', 'risk'],
  maxProperties: 10, // TODO - amend base schema
  minProperties: 0,
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    address: {
      type: 'object',
      properties: {
        addressLine1: { type: 'string' },
        addressLine2: { type: 'string' },
        addressLine3: { type: 'string' },
        addressLine4: { type: 'string' },
        addressLine5: { type: 'string' },
        region: { type: 'string' },
        subRegion: { type: 'string' },
        country: { type: 'string' },
        postCode: { type: 'string' },
        geo: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
    occupancy: {
      type: 'object',
      properties: {
        storiesNumber: { type: 'number' },
        yearBuilt: { type: 'number' },
        occupancyCode: { type: 'string' },
        construction: {
          type: 'string',
          enum: ['wood', 'concrete', 'stone', 'brick'],
        },
        floorArea: { type: 'number' },
        buildingCat: {
          type: 'string',
          enum: ['household', 'business', 'government'],
        },
      },
    },
    risk: {
      type: 'object',
      properties: {
        fire: {
          type: 'object',
          properties: {
            class: { type: 'string' },
            alerting: { type: 'string' },
            waterSupply: { type: 'string' },
            sprinklerQty: { type: 'number' },
            sprinklerClass: { type: 'string' },
            smokeDetcQty: { type: 'number' },
            smokeDetcClass: { type: 'string' },
          },
        },
        theft: {
          type: 'object',
          properties: {
            class: { type: 'string' },
            alerting: { type: 'string' },
            cameraQty: { type: 'number' },
            cameraClass: { type: 'string' },
            alarmDetcQty: { type: 'number' },
            alarmDetcClass: { type: 'string' },
          },
        },
      },
    },
    createdAt: {
      instanceof: 'Date',
    },
  },
};
