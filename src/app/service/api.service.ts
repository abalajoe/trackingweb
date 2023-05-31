import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import {Auth} from "../models/auth";
import {Product} from "../models/product";
import {SettingsHttpService} from "./settings-http.service";
import {User} from "../models/user";
import {Event} from "../models/event";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private appConfigService: SettingsHttpService) { }
  url: string = this.appConfigService.getConfig().appInsightsKey;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  authenticate(user: any) {

    console.log("url -> ", this.url)
    const url = this.url+"/login";
    return this.http.post<Auth>(url, user, this.httpOptions);
  }

  findAllProducts() {
    const url = this.url + '/product/findAllProducts';
    return this.http.get<Product[]>(url, this.httpOptions);
  }

  findAllUsers() {
    const url = this.url + '/user/findAllUsers';
    return this.http.get<User[]>(url, this.httpOptions);
  }

  findAllProductsByRecipient(email: string) {
    const url = this.url + '/product/findAllProductsByRecipient?email='+email;
    return this.http.get<Product[]>(url, this.httpOptions);
  }

  createProduct(data: any) {
    const url = this.url+"/product/create";
    return this.http.post<Product>(url, data);
  }

  editProduct(id: number, data: any) {
    const url = this.url+"/product/edit?id="+id;
    return this.http.put<Product>(url, data);
  }

  event(id: number, custodian: string, location: string) {
    const url = this.url+"/product/event?id="+id+"&custodian="+custodian+"&location="+location;
    return this.http.put<Product>(url, {});
  }

  findEventsByProduct(id: number) {
    const url = this.url+"/event/findAllEventsByProductId?id="+id;
    return this.http.get<Event[]>(url, {});
  }
}
