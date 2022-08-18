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
        loadChildren: () => import('../detail/detail.module').then(m => m.DetailPageModule)
      },
      {
        path: 'record',
        loadChildren: () => import('../record/record.module').then(m => m.RecordPageModule)
      },
      {
        path: 'list',
        loadChildren: () => import('../list/list.module').then(m => m.ListPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule { }
