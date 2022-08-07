import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import SwiperCore, { Pagination } from 'swiper';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
