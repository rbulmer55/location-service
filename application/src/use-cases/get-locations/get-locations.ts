import { LocationDTO } from '@dto/location';
import { logger, schemaValidator } from '@shared';
import { schema } from '@schemas/location';
import { createLocationAdapter } from '@adapters/secondary/create-location/create-location.adapter';
import { Location } from '@models/location';
import { v4 as uuid } from 'uuid';
import { checkFireAssets } from '@shared/location/check-fire-assets';
import { checkTheftAssets } from '@shared/location/check-theft-assets';
import {
  LocationFilter,
  LocationFilterDTO,
} from '@shared/location/types/location-filters';
import { ValidationError } from '@errors/validation-error';
import { getLocationsAdapter } from '@adapters/secondary/get-locations/get-locations.adapter';

export async function getLocationsUseCase(
  locationFilters: LocationFilterDTO,
): Promise<Location[]> {
  const { metadata, ...filter } = locationFilters;

  const dbFilter: LocationFilter = {
    ...filter,
    metadata: {
      paginiationLimit: metadata.limit || 10,
      sortOrder: { ...metadata.sortOrder, _id: 1 },
      nextToken: metadata.lastDocument,
    },
  };

  schemaValidator(schema, dbFilter);

  /**
   * business logic e.g. limit pagination
   */
  checkPagination(dbFilter);

  const locations = await getLocationsAdapter(dbFilter);

  logger.info(`locations fetched: ${locations.length}`);

  return locations;
}

const checkPagination = (dbFilter: LocationFilter) => {
  if (dbFilter.metadata.paginiationLimit < 0) {
    throw new ValidationError('Pagination must be higher than 0');
  }
  if (dbFilter.metadata.paginiationLimit > 100) {
    throw new ValidationError('Pagination must be less than 100');
  }
};
