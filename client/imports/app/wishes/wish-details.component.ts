import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MouseEvent } from "angular2-google-maps/core";

import 'rxjs/add/operator/map';

import { Wishes } from '../../../../both/collections/wishes.collection';
import { Wish } from '../../../../both/models/wish.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';

import template from './wish-details.component.html';
import style from './wish-details.component.scss';

@Component({
  selector: 'wish-details',
  template,
  styles: [ style ]
})
@InjectUser('user')
export class WishDetailsComponent implements OnInit, OnDestroy {
  wishId: string;
  paramsSub: Subscription;
  wish: Wish;
  wishSub: Subscription;
  users: Observable<User>;
  uninvitedSub: Subscription;
  user: Meteor.User;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['wishId'])
      .subscribe(wishId => {
        this.wishId = wishId;
        
        if (this.wishSub) {
          this.wishSub.unsubscribe();
        }

        this.wishSub = MeteorObservable.subscribe('wish', this.wishId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.wish = Wishes.findOne(this.wishId);
            this.getUsers(this.wish);
          });
        });

        if (this.uninvitedSub) {
          this.uninvitedSub.unsubscribe();
        }

        this.uninvitedSub = MeteorObservable.subscribe('uninvited', this.wishId).subscribe(() => {
          this.getUsers(this.wish);
        });
      });
  }

  getUsers(wish: Wish) {
    if (wish) {
      this.users = Users.find({
        _id: {
          $nin: wish.added || [],
          $ne: Meteor.userId()
        }
      }).zone();
    }
  }

  saveWish() {
    if (!Meteor.userId()) {
      alert('Please log in to change this wish');
      return;
    }
    
    Wishes.update(this.wish._id, {
      $set: {
        name: this.wish.name,
        description: this.wish.description,
        public: this.wish.public
      }
    });
  }

  invite(user: Meteor.User) {
    MeteorObservable.call('invite', this.wish._id, user._id).subscribe(() => {
      alert('User successfully added.');
    }, (error) => {
      alert(`Failed to add due to ${error}`);
    });
  }

  reply(rsvp: string) {
    MeteorObservable.call('reply', this.wish._id, rsvp).subscribe(() => {
      alert('You successfully replied.');
    }, (error) => {
      alert(`Failed to reply due to ${error}`);
    });
  }

  get isOwner(): boolean {
    return this.wish && this.user && this.user._id === this.wish.owner;
  }

  get isPublic(): boolean {
    return this.wish && this.wish.public;
  }

  get isAdded(): boolean {
    if (this.wish && this.user) {
      const added = this.wish.added || [];

      return added.indexOf(this.user._id) !== -1;
    }

    return false;
  }


  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.wishSub.unsubscribe();
    this.uninvitedSub.unsubscribe();
  }
}
