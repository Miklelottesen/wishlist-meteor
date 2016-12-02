import { Meteor } from 'meteor/meteor';

import { loadWishes } from './imports/fixtures/wishes';

import './imports/publications/wishes';
import './imports/publications/users';
import '../both/methods/wishes.methods';
import './imports/publications/images';

Meteor.startup(() => {
  loadWishes();
});
