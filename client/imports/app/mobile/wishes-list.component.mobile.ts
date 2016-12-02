import { Component } from '@angular/core';
import { PaginationService } from 'ng2-pagination';
import { WishesList } from "../shared-components/wishes-list.class";

import template from './wishes-list.component.mobile.html';

@Component({
  selector: 'wishes-list',
  template
})
export class WishesListMobileComponent extends WishesList {
  constructor(paginationService: PaginationService) {
    super(paginationService);
  }
}
