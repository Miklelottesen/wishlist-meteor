import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Wishes } from '../../../both/collections/wishes.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('wishes', function(options: Options, ownerMail?: string) {
  if(this.userId){
    const selector = buildQuery.call(this, null, ownerMail);

    Counts.publish(this, 'numberOfWishes', Wishes.collection.find(selector), { noReady: true });

    return Wishes.find(selector, options);
  }
});

Meteor.publish('wish', function(wishId: string) {
  if(this.userId)
    return Wishes.find(buildQuery.call(this, wishId));
});


function buildQuery(wishId?: string, ownerMail?: string): Object {
  const isAvailable = {
    $or: [{
      // wish is public
      public: true
    },
    // or
    {
      // current user is the owner
      $and: [{
        owner: this.userId
      }, {
        owner: {
          $exists: true
        }
      }]
    },
    {
      $and: [
        { invited: this.userId },
        { invited: { $exists: true } }
      ]
    }]
  };

  if (wishId) {
    return {
      // only single wish
      $and: [{
          _id: wishId
        },
        isAvailable
      ]
    };
  }

  const searchRegEx = { '$regex': '.*' + (ownerMail || '') + '.*', '$options': 'i' };

  return {
    $and: [{
        'ownerMail': searchRegEx
      },
      isAvailable
    ]
  };
}