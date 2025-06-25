import { ObjectId } from 'mongodb';

enum Construction {
  'wood',
  'concrete',
  'stone',
  'brick',
}

enum BuildingCategory {
  'household',
  'buisness',
  'government',
}

export type LocationDTO = {
  id?: string;
  name: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    addressLine5: string;
    region: string;
    subRegion: string;
    country: string;
    postCode: string;
    geo: number[];
  };
  occupancy: {
    storiesNumber: number;
    yearBuilt: number;
    occupancyCode: string;
    construction: Construction;
    floorArea: number;
    buildingCat: BuildingCategory;
  };
  risk: {
    fire: {
      class: string;
      alerting: string;
      waterSupply: string;
      sprinklerQty: number;
      sprinklerClass: string;
      smokeDetcQty: number;
      smokeDetcClass: string;
    };
    theft: {
      class: string;
      alerting: string;
      cameraQty: number;
      cameraClass: string;
      alarmDetcQty: number;
      alarmDetcClass: string;
    };
  };
  createdAt?: Date;
};
