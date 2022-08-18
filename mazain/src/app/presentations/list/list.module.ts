import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';

import { ListPage } from './list.page';
import { HeaderComponentModule } from '../share/header/header.component.module';

import { SwiperModule } from 'swiper/angular';
import { MazainCardComponentModule } from '../share/mazain-card/mazain-card.module';
import { MazainCardPlusComponentModule } from '../share/mazain-card-plus/mazain-card-plus.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPageRoutingModule,
    HeaderComponentModule,
    SwiperModule,
    MazainCardComponentModule,
    MazainCardPlusComponentModule,
  ],
  declarations: [ListPage]
})
export class ListPageModule { }
