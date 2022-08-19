import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordPageRoutingModule } from './record-routing.module';

import { SwiperModule } from 'swiper/angular';
import { RecordPage } from './record.page';
import { HeaderComponentModule } from '../share/header/header.component.module';
import { MazaiLineGraphComponentModule } from '../share/graphs/mazai-line-graph/mazai-line-graph.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordPageRoutingModule,
    HeaderComponentModule,
    SwiperModule,
    MazaiLineGraphComponentModule,
  ],
  declarations: [
    RecordPage,
  ]
})
export class RecordPageModule { }
