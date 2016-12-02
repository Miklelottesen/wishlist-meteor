import {Pipe, PipeTransform} from '@angular/core';
import {Wish} from "../../../../both/models/wish.model";
import {Wishes} from "../../../../both/collections/wishes.collection";

@Pipe({
  name: 'rsvp'
})
export class RsvpPipe implements PipeTransform {
  transform(wish: Wish, type: string): number {
    if (!type) {
      return 0;
    }

    let total = 0;
    const found = Wishes.findOne(wish._id);

    if (found)
      total = found.rsvps ? found.rsvps.filter(rsvp => rsvp.response === type).length : 0;

    return total;
  }
}