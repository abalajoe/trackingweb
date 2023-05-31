import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Product} from "../models/product";
import {ApiService} from "../service/api.service";
import {NotificationService} from "../service/notification.service";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductModalComponent} from "../modal/product-modal/product-modal.component";
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild("status",{static:true}) status: ElementRef | undefined;
  @ViewChild("edit",{static:true}) edit: ElementRef | undefined;

  updatedid: number = 0;
  nameedit: string = "";
  dtRow: any;
  loading: boolean = false;
  closeResult = '';
  dtProductDatatable: any;
  products: Product[] = [];
  role: any;
  email: any;
  constructor(private api: ApiService,
              private notifyService: NotificationService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.role = localStorage.getItem("roles");
    this.email = localStorage.getItem("email");
    this.initDatatables([]);

    //this.findAllUsers();
    if (this.role == "ROLE_ADMIN"){
      this.findAllProducts();
    } else {
      this.findAllProductsByRecipient(this.email);
    }
  }

  findAllProducts(){
    this.api.findAllProducts().subscribe(
      (data: Product[]) => {

        if (data.length == 0){
          this.notifyService.showSuccess("No products available for recipient", "No Products");
          return;
        }
        this.products = data;
        console.log("prod -- ", this.products);
        //this.dtProductDatatable.row.add(this.products).draw(false);
        this.dtProductDatatable.clear().rows.add(data).draw();
        //this.images = this.properties.
      }, error => {
        console.log(error);
      });
  }
  findAllProductsByRecipient(email: string){
    this.api.findAllProductsByRecipient(email).subscribe(
      (data: Product[]) => {
        if (data.length == 0){
          this.notifyService.showSuccess("No products available for recipient", "No Products");
          return;
        }
        this.products = data;
        console.log("prod -- ", this.products);
        //this.dtProductDatatable.row.add(this.products).draw(false);
        this.dtProductDatatable.clear().rows.add(data).draw();
        //this.images = this.properties.
      }, error => {
        console.log(error);
      });
  }
  open() {
    this.openModal(ProductModalComponent, {tag: "create"}, 'md');
  }

  openModal(view: any, data: any, size: string) {
    const modalRef = this.modalService.open(view, {size: size, centered: true });
    modalRef.componentInstance.modalData = data;
    modalRef.componentInstance.passEntry.subscribe((result: { tag: string; }) => {
      if (result) {
        if (result.tag === 'status') {
          this.event(result, modalRef);
        } else if (result.tag === 'edit') {
          this.update(result, modalRef);
        } else if (result.tag === 'create') {
          this.create(result, modalRef);
        }
      }
    });
  }

  initDatatables(data:any) {
    const dtOptions = {
      data,
      responsive: true,
      destroy: true,
      retrieve: true,
      dom: 'Bfrtip',
      order: [[0, 'desc']],
      buttons: [
      ],
      columnDefs: [{
        targets: [9,10,11], // column index (start from 0)
        orderable: false, // set orderable false for selected columns
      }],
      columns: [
        {
          title: 'Name',
          data: 'name',
          className: 'text-center'
        },
        {
          title: 'Quantity',
          data: 'quantity',
          className: 'text-center'
        },
        {
          title: 'Cost',
          data: null,
          className: 'text-center',
          // tslint:disable-next-line:variable-name
          render: (_data: any, type: any, row: { cost: string; }) => {
            return '$' + row.cost;
          }
        },
        {
          title: 'Recipient',
          data: 'recipient',
          className: 'text-center'
        },
        {
          title: 'Custodian',
          data: 'custodian',
          className: 'text-center'
        },
        {
          title: 'Location',
          data: 'location',
          className: 'text-center'
        },
        {
          title: 'Delivery Address',
          data: 'deliveryaddress',
          className: 'text-center'
        },
        {
          title: 'Created',
          data: 'createddate',
          className: 'text-center'
        },
        {
          title: 'Updated',
          data: 'updateddate',
          className: 'text-center'
        },
        {
          title: '',
          data: null,
          className: 'text-center edit',
          defaultContent: '<i class="fa fa-pencil" style="color: blue; cursor: pointer; align-content: center; text-align: center; font-style: normal; "></>',
          responsivePriority: 1
        },
        {
          title: '',
          data: null,
          className: 'text-center status',
          defaultContent: '<i class="fa fa-hourglass-half" style="color: brown; cursor: pointer; align-content: center; text-align: center; font-style: normal; " ></>',
          responsivePriority: 1
        },
        {
          title: '',
          data: null,
          className: 'text-center events',
          defaultContent: '<i  class="fa fa-bars" style="color: brown; cursor: pointer; align-content: center; text-align: center; font-style: normal; " ></>',
          responsivePriority: 1
        },
      ]
    };

    this.dtProductDatatable = $('#dtProduct').DataTable(dtOptions);
    const scope = this;

    if (this.role == 'ROLE_USER'){
      console.log("column 9");
      this.dtProductDatatable.column( 9 ).visible( false );
      this.dtProductDatatable.column( 10 ).visible( false );
    }
    const productDiv = '#dtProduct tbody';

    $(productDiv).on('click', 'td.edit', function() {
      const tr = $(this).closest('tr');
      const rowIndex = tr.index();
      const row = scope.dtProductDatatable.row(tr);
      const data = row.data();
      scope.updatedid = data.id;
      scope.nameedit = data.name;
      scope.dtRow = row;

      const rawData = row.data();
      rawData.rowToEdit = $(this).parents('tr');
      rawData.tag = 'edit';
      rawData.rowIndex = row;
      rawData.loading = false;
      scope.openModal(ProductModalComponent, rawData, 'md');
    });

    $(productDiv).on('click', 'td.status', function() {
      const tr = $(this).closest('tr');
      const rowIndex = tr.index();
      const row = scope.dtProductDatatable.row(tr);
      const data = row.data();
      console.log("theid -> ", data.id);
      scope.updatedid = data.id;
      scope.dtRow = row;
      const rawData = row.data();
      rawData.rowToEdit = $(this).parents('tr');
      rawData.tag = 'status';
      rawData.rowIndex = row;
      rawData.loading = false;
      scope.openModal(ProductModalComponent, rawData, 'md');
    });

    $(productDiv).on('click', 'td.events', function() {
      const tr = $(this).closest('tr');
      const rowIndex = tr.index();
      const row = scope.dtProductDatatable.row(tr);
      const data = row.data();
      scope.updatedid = data.id;
      scope.dtRow = row;

      const rawData = row.data();
      rawData.rowToEdit = $(this).parents('tr');
      rawData.tag = 'events';
      rawData.rowIndex = row;
      rawData.loading = false;
      scope.openModal(ProductModalComponent, rawData, 'lg');
    });
  }

 // create(form: NgForm){
  create(data: any, modelRef: any){
    console.log(data)
    let product_name = data.productname;
    let product_quantity = data.productquantity;
    let cost = data.cost;
    let recipient = data.recipientname;
    let custodian = data.custodian;
    let location = data.location;
    let delivery_address = data.deliveryaddress;

    if (product_name == "" || product_quantity == "" || recipient == ""
        || cost == "" || custodian == "" || location == "" || delivery_address == ""){
       this.notifyService.showError("Please enter all fields", "Validation");
       return;
    }

    let product = {name: product_name, quantity: product_quantity, cost: cost, recipient: recipient,
      custodian: custodian, location: location, deliveryAddress: delivery_address};
    console.log("product", product);
    this.api.createProduct(product).subscribe(
      (data: Product) => {
        console.log(data)
        this.modalService.dismissAll();
        this.notifyService.showSuccess("Successfully created " + name, "Success");
        this.dtProductDatatable.row.add(data).draw(false);
      },
      error => {
        console.log("error", error);
        this.loading = false;
        this.notifyService.showError("Something went wrong", "Oops");
      }
    );
  }

  update(data: any, modelRef: any){
    console.log(data)
    let id = data.id;
    let product_name = data.name;
    let product_quantity = data.quantity;
    let cost = data.cost;
    let recipient = data.recipient;
    let custodian = data.custodian;
    let location = data.location;
    let delivery_address = data.deliveryaddress;

    if (id == "" || product_name == "" || product_quantity == "" || recipient == ""
      || cost == "" || custodian == "" || location == "" || delivery_address == ""){
      this.notifyService.showError("Please enter all fields", "Validation");
      return;
    }

    let product = {name: product_name, quantity: product_quantity, cost: cost, recipient: recipient,
      custodian: custodian, location: location, deliveryAddress: delivery_address};
    console.log("product", product);

    this.api.editProduct(id, product).subscribe(
      (d: Product) => {
        console.log(data)
        this.modalService.dismissAll();
        this.notifyService.showSuccess("Successfully edited " + product_name, "Success");
        this.dtProductDatatable.row(data.rowIndex).data(d).invalidate().draw();
      },
      error => {
        console.log("error", error);
        this.loading = false;
        this.notifyService.showError("Something went wrong", "Oops");
      }
    );
  }

  event(data: any, modelRef: any){
    console.log(data)
    let id = data.id;
    let custodian = data.custodianupdate;
    let location = data.locationupdate;

    if (custodian == "" || location == ""){
      this.notifyService.showError("Please enter all fields", "Validation");
      return;
    }

    this.api.event(id, custodian, location).subscribe(
      (d: Product) => {
        console.log(d)
        modelRef.close();
        this.notifyService.showSuccess("Successfully updated " + d.name, "Success");
        this.dtProductDatatable.row(data.rowIndex).data(d).invalidate().draw();
      },
      error => {
        console.log("error", error);
        this.loading = false;
        this.notifyService.showError("Something went wrong", "Oops");
      }
    );
  }
}
