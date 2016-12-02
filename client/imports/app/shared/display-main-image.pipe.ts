import {Pipe, PipeTransform} from '@angular/core';
import { Images } from '../../../../both/collections/images.collection';
import { Wish } from '../../../../both/models/wish.model';
import { Meteor } from "meteor/meteor";

@Pipe({
  name: 'displayMainImage'
})
export class DisplayMainImagePipe implements PipeTransform {
  transform(wish: Wish) {
    if (!wish) {
      return;
    }

    let imageUrl: string;
    let imageId: string = (wish.images || [])[0];

    const found = Images.findOne(imageId);

    if (found) {
      if (!Meteor.isCordova) {
        imageUrl = found.url;
      } else {
        const path = `ufs/${found.store}/${found._id}/${found.name}`;
        imageUrl = Meteor.absoluteUrl(path);
      }
    }

    return imageUrl;
  }
}