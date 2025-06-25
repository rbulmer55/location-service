import { LocationDTO } from '@dto/location';
import { logger, schemaValidator } from '@shared';
import { schema } from '@schemas/location';
import { createLocationAdapter } from '@adapters/secondary/create-location/create-location.adapter';
import { Location } from '@models/location';
import { v4 as uuid } from 'uuid';
import { checkFireAssets } from '@shared/location/check-fire-assets';
import { checkTheftAssets } from '@shared/location/check-theft-assets';

export async function createLocationUseCase(
  locationEntry: LocationDTO,
): Promise<Location> {
  const id: string = uuid();
  const createdAt = new Date();

  const locationEntity: Location = { ...locationEntry, createdAt, id };

  schemaValidator(schema, locationEntity);

  /**
   * business logic e.g. A location cannot be marked as fire safe
   * if there are no sprinklers or detectors
   */
  checkFireAssets(locationEntity);
  /**
   * business logic e.g. A location cannot be marked as theft safe
   * if there are no alarms or detectors
   */
  checkTheftAssets(locationEntity);

  await createLocationAdapter(locationEntity);

  logger.info(`location created: ${locationEntity.name}-${id}`);

  return locationEntity;
}
