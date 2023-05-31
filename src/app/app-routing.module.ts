import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthorizeGuard} from "./guard/authorize.guard";

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {
    path: '',
    loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    canActivate: [AuthorizeGuard],
    loadChildren: () => import('src/app/home/home.module').then(m => m.HomeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
