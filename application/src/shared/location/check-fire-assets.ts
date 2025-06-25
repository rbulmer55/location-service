import { Location } from '@models/location';

export function checkFireAssets(location: Location): void {
  const { fire } = location.risk;

  if (fire.smokeDetcClass && (!fire.smokeDetcQty || fire.smokeDetcQty === 0)) {
    throw new Error(
      'Fire Risk: Smoke Detector Class is not applicable for locations with no smoke detectors.',
    );
  }

  if (fire.sprinklerClass && (!fire.sprinklerQty || fire.sprinklerQty === 0)) {
    throw new Error(
      'Fire Risk: Sprinkler Class is not applicable for locations with no sprinklers.',
    );
  }
}
