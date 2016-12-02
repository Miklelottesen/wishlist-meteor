import {Wishes} from '../collections/wishes.collection';
import {Email} from 'meteor/email';
import {check} from 'meteor/check';
import {Meteor} from 'meteor/meteor';

function getContactEmail(user:Meteor.User):string {
  if (user.emails && user.emails.length)
    return user.emails[0].address;

  return null;
}

Meteor.methods({
  invite: function (wishId:string, userId:string) {
    check(wishId, String);
    check(userId, String);

    let wish = Wishes.collection.findOne(wishId);

    if (!wish)
      throw new Meteor.Error('404', 'No such wish!');

    if (wish.public)
      throw new Meteor.Error('400', 'That wish is public. No need to add people.');

    if (wish.owner !== this.userId)
      throw new Meteor.Error('403', 'No permissions!');

    if (userId !== wish.owner && (wish.added || []).indexOf(userId) == -1) {
      Wishes.collection.update(wishId, {$addToSet: {invited: userId}});

      let from = getContactEmail(Meteor.users.findOne(this.userId));
      let to = getContactEmail(Meteor.users.findOne(userId));

      if (Meteor.isServer && to) {
        Email.send({
          from: 'noreply@socially.com',
          to: to,
          replyTo: from || undefined,
          subject: 'PARTY: ' + wish.name,
          text: `Hi, I just invited you to ${wish.name} on Wishlist.
                        \n\nCome check it out: ${Meteor.absoluteUrl()}\n`
        });
      }
    }
  },
  reply: function(wishId: string, rsvp: string) {
    check(wishId, String);
    check(rsvp, String);

    if (!this.userId)
      throw new Meteor.Error('403', 'You must be logged-in to reply');

    if (['yes', 'no', 'maybe'].indexOf(rsvp) === -1)
      throw new Meteor.Error('400', 'Invalid RSVP');

    let wish = Wishes.findOne({ _id: wishId });

    if (!wish)
      throw new Meteor.Error('404', 'No such wish');

    if (wish.owner === this.userId)
      throw new Meteor.Error('500', 'You are the owner!');

    if (!wish.public && (!wish.added || wish.added.indexOf(this.userId) == -1))
      throw new Meteor.Error('403', 'No such wish'); // its private, but let's not tell this to the user

    let rsvpIndex = wish.rsvps ? wish.rsvps.findIndex((rsvp) => rsvp.userId === this.userId) : -1;

    if (rsvpIndex !== -1) {
      // update existing rsvp entry
      if (Meteor.isServer) {
        // update the appropriate rsvp entry with $
        Wishes.update(
          { _id: wishId, 'rsvps.userId': this.userId },
          { $set: { 'rsvps.$.response': rsvp } });
      } else {
        // minimongo doesn't yet support $ in modifier. as a temporary
        // workaround, make a modifier that uses an index. this is
        // safe on the client since there's only one thread.
        let modifier = { $set: {} };
        modifier.$set['rsvps.' + rsvpIndex + '.response'] = rsvp;

        Wishes.update(wishId, modifier);
      }
    } else {
      // add new rsvp entry
      Wishes.update(wishId,
        { $push: { rsvps: { userId: this.userId, response: rsvp } } });
    }
  }
});