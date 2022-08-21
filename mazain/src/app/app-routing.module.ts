import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./presentations/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./presentations/list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'injecting',
    loadChildren: () => import('./presentations/injecting/injecting.module').then(m => m.InjectingPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./presentations/detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'tab',
    loadChildren: () => import('./presentations/tab/tab.module').then(m => m.TabPageModule)
  },
  {
    path: '',
    redirectTo: 'tab/list',
    pathMatch: 'full'
  },
  {
    path: 'record',
    loadChildren: () => import('./presentations/record/record.module').then(m => m.RecordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
