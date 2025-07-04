import { ObjectId } from 'mongodb';

export function toMongoDoc<T extends { id: string }>(entity: T) {
  const { id, ...rest } = entity;
  return {
    _id: new ObjectId(id),
    ...rest,
  };
}
