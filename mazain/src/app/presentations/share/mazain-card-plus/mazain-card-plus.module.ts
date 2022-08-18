import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazainCardPlusComponent } from './mazain-card-plus.component';
import { MazaiInputModalComponentModule } from '../mazai-input-modal/mazai-input.modal.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MazaiInputModalComponentModule,
  ],
  declarations: [MazainCardPlusComponent],
  exports: [MazainCardPlusComponent]
})
export class MazainCardPlusComponentModule { }
