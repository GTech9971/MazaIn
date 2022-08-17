import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SwiperCore, { Pagination } from 'swiper';
import { MazaiData } from '../../models/Mazai.data';
import { MazaiService } from '../../services/Mazai.service';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListPage implements OnInit, OnDestroy {

  mazaiList: MazaiData[];
  private readonly destroy$: Subject<void>;
  readonly mazaiObserver: Observable<MazaiData[]>;

  constructor(private mazaiService: MazaiService) {
    this.mazaiList = [];
    this.destroy$ = new Subject<void>();
    this.mazaiObserver = this.mazaiService.MazaiListObserver$;
    this.mazaiObserver.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.mazaiList = list;
    });
  }

  async ngOnInit() {
    this.mazaiService.fetchMazaiList();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
