import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/service/notification.service';
import {ApiService} from "../../service/api.service";
import {User} from "../../models/user";
import {Event} from "../../models/event";

@Component({
  selector: 'app-user-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.css']
})
export class ProductModalComponent implements OnInit {
  @Input() public modalData: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  user: User[] = [];
  event: Event[] = [];
  resolve = true;

  constructor(
    private api: ApiService,
    public activeModal: NgbActiveModal,
    private notifyService: NotificationService,
  ) {
  }

  ngOnInit() {
    console.log('modal =2> ', this.modalData);
    if(this.modalData.tag == 'create'){
        this.findAllUsers();
    } else if(this.modalData.tag == 'events'){
      this.findEventsByProduct(this.modalData.id);
    }

  }

  findAllUsers(){
    this.api.findAllUsers().subscribe(
      (data: User[]) => {
        if (data.length == 0){
          this.notifyService.showSuccess("No users available", "No Users");
          return;
        }

        data.forEach((user) => {
          if (user.roles == "ROLE_USER"){
            this.user.push(user);
          }
        });

      }, error => {
        console.log(error);
      });
  }

  findEventsByProduct(id: number){
    this.api.findEventsByProduct(id).subscribe(
      (data: Event[]) => {
        if (data.length == 0){
          this.notifyService.showSuccess("No events available", "No Events");
          return;
        }

        this.event = data;

      }, error => {
        console.log(error);
      });
  }

  passBack(event: any) {
    this.modalData.loading = true;
    if (this.resolve) {
      this.passEntry.emit(this.modalData);
    } else {
      this.notifyService.showError('Please fill the form as advised', 'Something is wrong with form');
    }
  }
}
