import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InjectingPage } from './injecting.page';

const routes: Routes = [
  {
    path: '',
    component: InjectingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InjectingPageRoutingModule {}
