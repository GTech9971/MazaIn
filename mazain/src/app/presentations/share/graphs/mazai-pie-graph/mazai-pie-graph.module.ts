import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazaiPieGraphComponent } from './mazai-pie-graph.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ], declarations: [
    MazaiPieGraphComponent,

  ], exports: [MazaiPieGraphComponent]
})
export class MazaiPieGraphComponentModule { }
