import { Meteor } from 'meteor/meteor';

import { Wishes } from '../../../both/collections/wishes.collection';

Meteor.publish('uninvited', function (wishId: string) {
  const wish = Wishes.findOne(wishId);

  if (!wish) {
    throw new Meteor.Error('404', 'No such wish!');
  }

  return Meteor.users.find({
    _id: {
      $nin: wish.added || [],
      $ne: this.userId
    }
  });
});
