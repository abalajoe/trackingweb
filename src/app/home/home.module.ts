import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import {HomeComponent} from "./home.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProductModalComponent} from "../modal/product-modal/product-modal.component";


@NgModule({
  declarations: [HomeComponent, NavbarComponent, ProductModalComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
