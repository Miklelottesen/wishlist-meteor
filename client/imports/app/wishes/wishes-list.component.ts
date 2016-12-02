import { Component } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { WishesList } from "../shared-components/wishes-list.class";

import template from './wishes-list.component.html';
import style from './wishes-list.component.scss';

@Component({
  selector: 'wishes-list',
  template,
  styles: [ style ]
})
export class WishesListComponent extends WishesList {
  constructor(paginationService: PaginationService) {
    super(paginationService);
  }
}
