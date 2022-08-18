import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { HeaderComponentModule } from '../share/header/header.component.module';
import { MazaiShowcaseComponentModule } from '../share/mazai-showcase/mazai-showcase.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    HeaderComponentModule,
    MazaiShowcaseComponentModule,
  ],
  declarations: [DetailPage]
})
export class DetailPageModule { }
