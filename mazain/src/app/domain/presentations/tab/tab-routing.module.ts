import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailPage } from '../detail/detail.page';
import { ListPage } from '../list/list.page';
import { RecordPage } from '../record/record.page';

import { TabPage } from './tab.page';

const routes: Routes = [
  {
    path: '',
    component: TabPage,
    children: [
      {
        path: 'detail',
        component: DetailPage
      },
      {
        path: 'record',
        component: RecordPage
      },
      {
        path: 'list',
        component: ListPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule { }
