import { Location } from '@models/location';

export function checkTheftAssets(location: Location): void {
  const { theft } = location.risk;

  if (
    theft.alarmDetcClass &&
    (!theft.alarmDetcQty || theft.alarmDetcQty === 0)
  ) {
    throw new Error(
      'Fire Risk: Alarm Class is not applicable for locations with no alarms.',
    );
  }

  if (theft.cameraClass && (!theft.cameraQty || theft.cameraQty === 0)) {
    throw new Error(
      'Fire Risk: Camera Class is not applicable for locations with no cameras.',
    );
  }
}
