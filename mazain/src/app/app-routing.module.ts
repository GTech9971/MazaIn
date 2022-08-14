import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./domain/presentations/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
