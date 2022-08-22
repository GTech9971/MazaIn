import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazaiImageComponent } from './mazai-image.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [MazaiImageComponent],
  exports: [MazaiImageComponent]
})
export class MazaiImageComponentModule {}
