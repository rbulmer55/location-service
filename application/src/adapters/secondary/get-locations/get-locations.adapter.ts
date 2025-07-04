import { BuildingCategory, Construction, Location } from '@models/location';
import { connect } from '@shared/databases-services/location-service/connection';
import { fromMongoDoc } from '@shared/databases-services/location-service/helpers/from-mongo-doc';
import { toMongoDoc } from '@shared/databases-services/location-service/helpers/to-mongo-doc';
import { LocationDB } from '@shared/databases-services/location-service/models';
import { LocationFilter } from '@shared/location/types/location-filters';
import { logger } from '@shared/logger';
import { ObjectId } from 'mongodb';

let db: ReturnType<typeof connect> extends Promise<infer DB> ? DB : never;

export const getLocationsAdapter = async (filter: LocationFilter) => {
  const { metadata, ...filters } = filter;

  // Dynamically build the occupancy filter
  const occupancySubFilter: Record<string, unknown> = {};
  if (filters.construction !== undefined) {
    occupancySubFilter.construction = filters.construction;
  }
  if (filters.buildingCat !== undefined) {
    occupancySubFilter.buildingCat = filters.buildingCat;
  }

  // Build the final filteredFields for Mongo query
  const filteredFields: Record<string, unknown> = {};
  if (Object.keys(occupancySubFilter).length > 0) {
    filteredFields.occupancy = occupancySubFilter;
  }

  const paginationFilter = metadata.nextToken
    ? {
        _id: {
          $gt:
            typeof metadata.nextToken === 'string'
              ? new ObjectId(metadata.nextToken)
              : metadata.nextToken,
        },
      }
    : {};

  logger.info('Secondary Get Locations Adapter: Connecting to database');
  if (!db) {
    db = await connect();
  }
  logger.info('Secondary Get Locations Adapter: Fetching Locations');
  const collection = db.collection<LocationDB>('locations');

  const docs = await collection
    .find({ ...filteredFields, ...paginationFilter })
    .sort(metadata.sortOrder)
    .limit(metadata.paginiationLimit)
    .toArray();

  const locations: Location[] = docs.map(fromMongoDoc);

  logger.info(`Locations fetched: ${locations.length}`);
  return locations;
};
