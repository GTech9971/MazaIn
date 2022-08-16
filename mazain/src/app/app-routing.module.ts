import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./domain/presentations/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./domain/presentations/list/list.module').then(m => m.ListPageModule)
  },
  {
    path: 'injecting',
    loadChildren: () => import('./domain/presentations/injecting/injecting.module').then(m => m.InjectingPageModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./domain/presentations/detail/detail.module').then(m => m.DetailPageModule)
  },
  {
    path: 'tab',
    loadChildren: () => import('./domain/presentations/tab/tab.module').then(m => m.TabPageModule)
  },
  {
    path: '',
    redirectTo: 'tab',
    pathMatch: 'full'
  },
  {
    path: 'record',
    loadChildren: () => import('./domain/presentations/record/record.module').then(m => m.RecordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
