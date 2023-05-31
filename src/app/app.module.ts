import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ApiService} from "./service/api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthorizeGuard} from "./guard/authorize.guard";
import {AuthenticationInterceptor} from "./interceptor/authentication.interceptor";
import {ToastrModule} from "ngx-toastr";
import {SettingsHttpService} from "./service/settings-http.service";

export function initConfig(appConfig: SettingsHttpService) {
  return () => appConfig.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [ApiService, AuthorizeGuard, {
    provide:HTTP_INTERCEPTORS, useClass:AuthenticationInterceptor, multi:true},
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [SettingsHttpService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
