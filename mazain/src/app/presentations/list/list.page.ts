import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SwiperCore, { Pagination, Swiper } from 'swiper';
import { MazaiData } from '../../domain/models/Mazai.data';
import { MazaiService } from '../../domain/services/Mazai.service';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListPage implements OnInit, OnDestroy {
  private slides: Swiper;

  mazaiList: MazaiData[];
  private readonly destroy$: Subject<void>;
  readonly mazaiObserver: Observable<MazaiData[]>;

  constructor(private mazaiService: MazaiService) {
    this.mazaiList = [];
    this.destroy$ = new Subject<void>();
    this.mazaiObserver = this.mazaiService.MazaiListObserver$;
    this.mazaiObserver.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.mazaiList = list;
      this.slides?.update();
    });
  }

  async ngOnInit() {
    await this.mazaiService.fetchMazaiList();
    this.slides?.update();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ionViewDidEnter() {
    this.slides?.update();
  }

  setSwiperInstance(swiper: Swiper) {
    this.slides = swiper;
  }

}
