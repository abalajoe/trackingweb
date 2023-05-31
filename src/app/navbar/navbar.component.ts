import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  navbarOpen = false;
  email: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.email = localStorage.getItem("email");
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logOut(){
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
