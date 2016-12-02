import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { WishesListComponent } from './wishes/wishes-list.component';
import { WishDetailsComponent } from './wishes/wish-details.component';
import {SignupComponent} from "./auth/signup.component";
import {RecoverComponent} from "./auth/recover.component";
import {LoginComponent} from "./auth/login.component.web";

export const routes: Route[] = [
  { path: '', component: WishesListComponent },
  { path: 'wish/:wishId', component: WishDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
