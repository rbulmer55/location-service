import { LocationDTO } from '@dto/location';
import { logger, schemaValidator } from '@shared';
import { schema } from '@schemas/location';
import { createLocationAdapter } from '@adapters/secondary/create-location/create-location.adapter';
import { Location } from '@models/location';
import { checkFireAssets } from '@shared/location/check-fire-assets';
import { checkTheftAssets } from '@shared/location/check-theft-assets';

export async function createLocationUseCase(
  locationEntry: LocationDTO,
): Promise<Location> {
  const createdAt = new Date();

  const locationEntity: Location = { ...locationEntry, createdAt };

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

  const location = await createLocationAdapter(locationEntity);

  logger.info(`location created: ${location.name}-${location.id}`);

  return location;
}
