import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazainCardPlusComponent } from './mazain-card-plus.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  declarations: [MazainCardPlusComponent],
  exports: [MazainCardPlusComponent]
})
export class MazainCardPlusComponentModule { }
