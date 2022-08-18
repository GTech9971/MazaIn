import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InjectingPageRoutingModule } from './injecting-routing.module';

import { InjectingPage } from './injecting.page';
import { HeaderComponentModule } from '../share/header/header.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InjectingPageRoutingModule,
    HeaderComponentModule,
  ],
  declarations: [InjectingPage]
})
export class InjectingPageModule {}
