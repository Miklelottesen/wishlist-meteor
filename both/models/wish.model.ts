import { CollectionObject } from './collection-object.model';

export interface Wish extends CollectionObject {
  name: string;
  description: string;
  owner?: string;
  ownerMail?: string;
  public: boolean;
  added?: string[];
  rsvps?: RSVP[];
  images?: string[];
}

interface RSVP {
  userId: string;
  response: string;
}

