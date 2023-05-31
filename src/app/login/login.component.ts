import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {Auth} from "../models/auth";
import {NotificationService} from "../service/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  constructor(private api: ApiService,
              private router: Router,
              private notifyService: NotificationService) { }

  ngOnInit(): void {
  }

  login(form: NgForm){
    let email = form.value.email;
    let password = form.value.password;
    if (email == "" || password == ""){
      this.notifyService.showError("Something went wrong, please try again", "Something went wrong");
      return
    }
    this.loading = true;

    let user = {email: email, password: password.trim()};

    this.api.authenticate(user).subscribe(
      (data: Auth) => {
        this.loading = false;
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        // @ts-ignore
        localStorage.setItem("roles", data.roles[0]['authority']);
         this.router.navigate(['/home']);
      },
      error => {
        this.loading = false;
        console.log("error", error);
       this.notifyService.showError("Invalid credentials, please try again", "Invalid Credentials");
      }
    );
  }
}
