// Angular Import
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { PlaceSearchResult, RequestPostViewModel, RequestVendorDetailsModel, RequestVendorModel } from './model/place-search-result';
import { Location, LocationStrategy } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { BerryConfig } from '../app-config';
import { CustomerService } from '../services/customer/customer.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, map, timer } from 'rxjs';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})

export class CustomerComponent {
  navCollapsed: boolean;
  navCollapsedMob: boolean;
  fromvalue: PlaceSearchResult | undefined;
  tovalue: PlaceSearchResult | undefined;
  windowWidth: number;
  customerId: number;
  customerTypeId: number;
  vendorModel: RequestVendorModel;
  statusSubscription!: any;
  responces: any;
  showLocationFilter: boolean = true;
  stageId: number = 0;

  // Constructor
  constructor(private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router) {

    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (current_url === this.location['_baseHref'] + '/layout/theme-compact' || current_url === this.location['_baseHref'] + '/layout/box')
      this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  ngOnInit() {
    if (localStorage.getItem("UserTypeID") != undefined) {
      clearInterval(this.statusSubscription);
      this.customerTypeId = +localStorage.getItem("UserTypeID");
      this.customerId = +localStorage.getItem("UserID");
      this.getCurrentRequestStatus(this.customerId);
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.statusSubscription);
  }

  getCurrentRequestStatus(customerId: number) {
    this.customerService.GetCurrentStatusByCustomer(customerId)
      .subscribe(
        (response) => {
          this.responces = response;
          if (this.responces.status == 1) {
            if (this.responces.data.currentStageId < 8) {
              if (this.responces.data.currentStageId == 2) {
                //Show Quoations
                console.log('Show Quoations');
                this.loadAllQuoations();
              }
              else {
                this.statusSubscription = setInterval(() => {
                  const res =
                    this.getCurrentRequestStatus(this.customerId);
                }, 20000);
              }
              this.showLocationFilter = false;
            }
            else {
              this.showLocationFilter = true;
            }
          }
          if (this.responces.status == 0) {
            this.toastr.error(response.message)
          }
          if (this.responces.status == 2) {
            this.showLocationFilter = true;
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")                    //error() callback
          console.log("Something went wrong")
        },
        () => {                                   //complete() callback

        })
  }

  loadAllQuoations() {
    this.customerService.GetAllQuotationRequest(this.customerId)
      .subscribe(
        (response) => {
          if (response.status == 1) {
            this.vendorModel = response.data;
            this.stageId = 2;
            console.log(response.data);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")                    //error() callback
          console.log("Something went wrong")
        },
        () => {

          let pickUp: PlaceSearchResult =
           {location:new google.maps.LatLng(this.vendorModel.pickupLocation.latitude, this.vendorModel.pickupLocation.longitude),
             address:this.vendorModel.pickupLocation.address};
             this.fromvalue = pickUp;

             let dropOff: PlaceSearchResult =
             {location:new google.maps.LatLng(this.vendorModel.dropOffLocation.latitude, this.vendorModel.dropOffLocation.longitude),
               address:this.vendorModel.dropOffLocation.address};
               this.tovalue = dropOff;
        })
  }

  ontriggerRequestChanged(data) {
    this.getCurrentRequestStatus(this.customerId);
  }

  // public method
  navMobClick() {
    if (this.navCollapsedMob && (document.querySelector('app-navigation.coded-navbar') as HTMLDivElement).classList.contains('mob-open')) {
      this.navCollapsedMob = !this.navCollapsedMob;
      setTimeout(() => {
        this.navCollapsedMob = !this.navCollapsedMob;
      }, 100);
    } else {
      this.navCollapsedMob = !this.navCollapsedMob;
    }
  }

  requestAcceptViewModel: RequestPostViewModel = new RequestPostViewModel();
  Accept(customerId : number , quoationDetailedId: number) {
    this.requestAcceptViewModel.customerId = customerId;
    this.requestAcceptViewModel.quoationDetailedId = quoationDetailedId;

    this.customerService.AcceptQuotationByCustomer(this.requestAcceptViewModel).subscribe(response => {
     console.log(response.status);
      if (response.status == 0 || response.status == 2) {
        this.toastr.error(response.message);
      }
      else {
        this.toastr.success(response.message);
        this.getCurrentRequestStatus(this.customerId);
      }
    });
  }
}
