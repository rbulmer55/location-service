import { Location } from '@models/location';
import { connect } from '@shared/databases-services/location-service/connection';
import { toMongoDoc } from '@shared/databases-services/location-service/helpers/to-mongo-doc';
import { LocationDB } from '@shared/databases-services/location-service/models';
import { logger } from '@shared/logger';

let db: ReturnType<typeof connect> extends Promise<infer DB> ? DB : never;

export const createLocationAdapter = async (location: Location) => {
  logger.info('Secondary Create Location Adapter: Connecting to database');
  if (!db) {
    db = await connect();
  }
  logger.info('Secondary Create Location Adapter: Creating Location');
  const collection = db.collection<LocationDB>('locations');
  const doc: LocationDB = toMongoDoc(location);
  const locationResult = await collection.insertOne(doc);

  logger.info('Location Created: ', locationResult.insertedId.toString());
  return location;
};
