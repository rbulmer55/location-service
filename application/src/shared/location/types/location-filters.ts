import { BuildingCategory, Construction } from '@models/location';

export type LocationFilterDTO = {
  construction?: Construction;
  buildingCat?: BuildingCategory;
  metadata: {
    pageSize?: number;
    lastDocument: string | null;
    sortOrder?: {
      [key: string]: 1 | -1;
    };
  };
};

export type LocationFilter = {
  construction?: Construction;
  buildingCat?: BuildingCategory;
  metadata: {
    paginiationLimit: number;
    nextToken: string | null;
    sortOrder: {
      [key: string]: 1 | -1;
    } & {
      _id: 1 | -1;
    };
  };
};
