import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazaiBarGraphComponent } from './mazai-bar-graph.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ], declarations: [MazaiBarGraphComponent],
  exports: [MazaiBarGraphComponent]
})
export class MazaiBarGraphComponentModule { }
