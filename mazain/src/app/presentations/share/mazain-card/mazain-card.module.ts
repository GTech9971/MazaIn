import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazainCardComponent } from './mazain-card.component';
import { MazaiInputModalComponentModule } from '../mazai-input-modal/mazai-input.modal.component.module';
import { MazaiImageComponentModule } from '../mazai-image/mazai-image.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MazaiInputModalComponentModule,
    MazaiImageComponentModule,
  ], declarations: [
    MazainCardComponent
  ], exports: [MazainCardComponent]
})
export class MazainCardComponentModule { }
