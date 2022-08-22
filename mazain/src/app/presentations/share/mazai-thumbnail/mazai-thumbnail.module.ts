import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazaiThumbnailComponent } from './mazai-thumbnail.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule,],
  declarations: [MazaiThumbnailComponent],
  exports: [MazaiThumbnailComponent]
})
export class MazaiThumbnailComponentModule {}
