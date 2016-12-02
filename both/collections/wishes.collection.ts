import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Wish } from '../models/wish.model';

export const Wishes = new MongoObservable.Collection<Wish>('wishes');

function loggedIn() {
  return !!Meteor.user();
}

Wishes.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
