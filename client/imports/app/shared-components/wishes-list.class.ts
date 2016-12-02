import {OnDestroy, OnInit} from "@angular/core";
import {Observable, Subscription, Subject} from "rxjs";
import {Wish} from "../../../../both/models/wish.model";
import {PaginationService} from "ng2-pagination";
import {MeteorObservable} from "meteor-rxjs";
import {Wishes} from "../../../../both/collections/wishes.collection";
import {Counts} from "meteor/tmeasday:publish-counts";
import {InjectUser} from "angular2-meteor-accounts-ui";


interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@InjectUser('user')
export class WishesList implements OnInit, OnDestroy {
  wishes: Observable<Wish[]>;
  wishesSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  wishesSize: number = 0;
  autorunSub: Subscription;
  ownerMail: Subject<string> = new Subject<string>();
  user: Meteor.User;
  imagesSubs: Subscription;

  constructor(private paginationService: PaginationService) {

  }

  ngOnInit() {
    this.imagesSubs = MeteorObservable.subscribe('images').subscribe();

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.ownerMail
    ).subscribe(([pageSize, curPage, nameOrder, ownerMail]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

      if (this.wishesSub) {
        this.wishesSub.unsubscribe();
      }

      this.wishesSub = MeteorObservable.subscribe('wishes', options, ownerMail).subscribe(() => {
        this.wishes = Wishes.find({}, {
          sort: {
            name: nameOrder
          }
        }).zone();
      });
    });

    this.paginationService.register({
      id: this.paginationService.defaultId,
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.wishesSize
    });

    this.pageSize.next(10);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.ownerMail.next('');

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.wishesSize = Counts.get('numberOfWishes');
      this.paginationService.setTotalItems(this.paginationService.defaultId, this.wishesSize);
    });
  }

  removeWish(wish: Wish): void {
    Wishes.remove(wish._id);
  }

  search(value: string): void {
    console.log("Searching for "+value);
    this.curPage.next(1);
    this.ownerMail.next(value);
  }

  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }

  isOwner(wish: Wish): boolean {
    return this.user && this.user._id === wish.owner;
  }

  ngOnDestroy() {
    this.wishesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
    this.imagesSubs.unsubscribe();
  }
}