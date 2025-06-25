const convict = require('convict');

export const config = convict({
  // shared config
  stage: {
    doc: 'The stage being deployed',
    format: String,
    default: '',
    env: 'STAGE',
  },
  dbConnectionSecret: {
    doc: 'The secret name for the database',
    format: String,
    default: 'dbConnectionSecret',
    env: 'DB_CONNECTION_SECRET',
  },
  databaseName: {
    doc: 'The name of the database',
    format: String,
    default: 'test',
    env: 'DB_NAME',
  },
}).validate({ allowed: 'strict' });
