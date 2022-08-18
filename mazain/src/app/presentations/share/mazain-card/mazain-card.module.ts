import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazainCardComponent } from './mazain-card.component';
import { MazaiInputModalComponentModule } from '../mazai-input-modal/mazai-input.modal.component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MazaiInputModalComponentModule,
  ], declarations: [
    MazainCardComponent
  ], exports: [MazainCardComponent]
})
export class MazainCardComponentModule { }
