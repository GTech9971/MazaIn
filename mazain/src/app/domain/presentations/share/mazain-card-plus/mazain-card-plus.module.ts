import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazainCardPlusComponent } from './mazain-card-plus.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [MazainCardPlusComponent],
  exports: [MazainCardPlusComponent]
})
export class MazainCardPlusComponentModule {}
