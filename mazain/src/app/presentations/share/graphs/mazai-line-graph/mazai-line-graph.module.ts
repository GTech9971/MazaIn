import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MazaiLineGraphComponent } from './mazai-line-graph.component';
import { SumPipe } from 'src/app/pipes/sum.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    MazaiLineGraphComponent,
    SumPipe
  ], exports: [MazaiLineGraphComponent]
})
export class MazaiLineGraphComponentModule { }
