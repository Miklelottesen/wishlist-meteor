import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Wishes } from '../../../../both/collections/wishes.collection';
import { InjectUser } from "angular2-meteor-accounts-ui";
import template from './wishes-form.component.html';
import style from './wishes-form.component.scss';

@Component({
  selector: 'wishes-form',
  template,
  styles: [ style ]
})
@InjectUser("user")
export class WishesFormComponent implements OnInit {
  addForm: FormGroup;
  images: string[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [],
      public: [false]
    });
  }

  addWish(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a wish');
      return;
    }

    if (this.addForm.valid) {
      Wishes.insert({
        name: this.addForm.value.name,
        description: this.addForm.value.description,
        images: this.images,
        public: this.addForm.value.public,
        owner: Meteor.userId(),
        ownerMail: Meteor.user().emails[0].address
      });

      this.addForm.reset();
    }
  }

  onImage(imageId: string) {
    this.images.push(imageId);
  }
}
