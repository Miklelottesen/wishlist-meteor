import { Wishes } from '../../../both/collections/wishes.collection';
import { Wish } from '../../../both/models/wish.model';

export function loadWishes() {
  if (Wishes.find().cursor.count() === 0) {
    const wishes: Wish[] = [{
      name: 'A pony',
      description: 'Pleasepleaseplease!',
      ownerMail: 'emma@hawthorneestates.com',
      public: true
    }, {
      name: 'Crayons',
      description: 'I like to draw',
      ownerMail: 'emma@hawthorneestates.com',
      public: true
    }, {
      name: 'Fiber cloths',
      description: 'Preferably the pale blue ones from Hay',
      ownerMail: 'john@hancock.nu',
      public: true
    }];

    //wishes.forEach((wish: Wish) => Wishes.insert(wish));
    // Disabled for production
  }
}