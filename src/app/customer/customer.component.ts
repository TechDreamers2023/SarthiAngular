// Angular Import
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { PastHistoryModel, PlaceSearchResult, RequestPostViewModel, RequestRejectViewModel, RequestVendorDetailsModel, RequestVendorModel, TrackServiceModel } from './model/place-search-result';
import { Location, LocationStrategy } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
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
  trackServiceModel: TrackServiceModel[];
  pastHistoryModel: PastHistoryModel = {
    pastStageId: 0,
    message: "",
    requestNumber: ""
  }

  modelInfo = {
    isSuccess: false,
    modelMessage: ""
  }

  title = 'appBootstrap';
  closeResult: string = '';

  // Constructor
  constructor(private zone: NgZone,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal) {

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
      if (localStorage.getItem('UserTypeID') == '4') {
        this.router.navigate(['/vendor']);
      }
      else {
        clearInterval(this.statusSubscription);
        this.customerTypeId = +localStorage.getItem("UserTypeID");
        this.customerId = +localStorage.getItem("UserID");
        this.getCurrentRequestStatus(this.customerId);
        this.statusSubscription = setInterval(() => {
          const res =
            this.getCurrentRequestStatus(this.customerId);
        }, 3000);
      }
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
          console.log(response);
          this.responces = response;
          if (this.responces.status == 1) {
            if (this.responces.data.currentStageId < 8) {
              if (this.responces.data.currentStageId == 2) {
                //Show Quoations 
                this.loadAllQuoations();
              }
              else {
                if ((this.responces.data.currentStageId == 3) ||
                  (this.responces.data.currentStageId == 4)
                  || (this.responces.data.currentStageId == 5)
                  || (this.responces.data.currentStageId == 6)
                  || (this.responces.data.currentStageId == 7)) {
                  this.loadActiveCustomerRequest();
                  this.loadTrackServiceRequest();
                  this.stageId = this.responces.data.currentStageId;
                }
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
            this.loadPastHistoryServiceRequest();
            clearInterval(this.statusSubscription);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")
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
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")
        },
        () => {
          let pickUp: PlaceSearchResult =
          {
            location: new google.maps.LatLng(this.vendorModel.pickupLocation.latitude, this.vendorModel.pickupLocation.longitude),
            address: this.vendorModel.pickupLocation.address
          };
          this.fromvalue = pickUp;

          let dropOff: PlaceSearchResult =
          {
            location: new google.maps.LatLng(this.vendorModel.dropOffLocation.latitude, this.vendorModel.dropOffLocation.longitude),
            address: this.vendorModel.dropOffLocation.address
          };
          this.tovalue = dropOff;
        })
  }

  loadActiveCustomerRequest() {
    this.customerService.GetActiveCustomerRequest(this.customerId)
      .subscribe(
        (response) => {
          if (response.status == 1) {
            this.vendorModel = response.data;
            console.log(response.data);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")                    //error() callback
        },
        () => {
          console.log(this.vendorModel);
          let pickUp: PlaceSearchResult =
          {
            location: new google.maps.LatLng(this.vendorModel.pickupLocation.latitude, this.vendorModel.pickupLocation.longitude),
            address: this.vendorModel.pickupLocation.address
          };
          this.fromvalue = pickUp;

          let dropOff: PlaceSearchResult =
          {
            location: new google.maps.LatLng(this.vendorModel.dropOffLocation.latitude, this.vendorModel.dropOffLocation.longitude),
            address: this.vendorModel.dropOffLocation.address
          };
          this.tovalue = dropOff;
        })
  }

  loadTrackServiceRequest() {
    this.customerService.GetTrackServiceRequest(this.customerId)
      .subscribe(
        (response) => {
          if (response.status == 1) {
            this.trackServiceModel = response.data;
            console.log(this.trackServiceModel);
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")                    //error() callback
          console.log("Something went wrong")
        },
        () => {

        })
  }

  loadPastHistoryServiceRequest() {
    this.customerService.GetPastTrackServiceRequest(this.customerId)
      .subscribe(
        (response) => {
          console.log(response);
          console.log(this.stageId);
          if (response.status == 1) {
            let message: string;

            if (response.data.pastStageId == 8) {
              message = "Request has been completed successfully";
            }

            if (response.data.pastStageId == 9) {
              message = "Request has been cancelled by vendor";
            }

            if (response.data.pastStageId == 10) {
              message = "Request has been cancelled by customer";
            }

            this.pastHistoryModel = {
              pastStageId: response.data.pastStageId,
              requestNumber: response.data.requestNumber,
              message: message
            }
          }
          else {
            this.pastHistoryModel = {
              pastStageId: 0,
              requestNumber: "N/A",
              message: "N/A"
            }
          }
        },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ")                    //error() callback
          console.log("Something went wrong")
        },
        () => {

        })
  }


  ontriggerRequestChanged(data) {
    this.getCurrentRequestStatus(this.customerId);
    this.modelInfo = {
      isSuccess: data.isSuccess,
      modelMessage: data.message
    }

    let element: HTMLElement = document.getElementById('modelSuccess') as HTMLElement;
    // add this condition will solve issue  
    if (element) {
      element.click();
    }

    if (data.isSuccess) {
      this.statusSubscription = setInterval(() => {
        const res =
          this.getCurrentRequestStatus(this.customerId);
      }, 3000);
    }

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
  Accept(customerId: number, quoationDetailedId: number) {
    this.requestAcceptViewModel.customerId = customerId;
    this.requestAcceptViewModel.quoationDetailedId = quoationDetailedId;
    this.customerService.AcceptQuotationByCustomer(this.requestAcceptViewModel).subscribe(response => {
      if (response.status == 0 || response.status == 2) {
        this.toastr.error(response.message);
      }
      else {
        this.toastr.success(response.message);
        this.getCurrentRequestStatus(this.customerId);
      }
    });
  }

  requestRejectViewModel: RequestRejectViewModel = new RequestRejectViewModel();
  CancelRequest(customerId: number, requestId: number) {
    this.requestRejectViewModel.customerId = customerId;
    this.requestRejectViewModel.requestId = requestId;
    this.customerService.RejectRequestByCustomer(this.requestRejectViewModel).subscribe(response => {
      if (response.status == 0 || response.status == 2) {
        this.toastr.error(response.message);
      }
      else {
        this.stageId = 0;
        this.getCurrentRequestStatus(this.customerId);
        this.fromvalue = null;
        this.tovalue = null;
        this.modelInfo = {
          isSuccess: true,
          modelMessage: response.message
        }

        let element: HTMLElement = document.getElementById('modelSuccess') as HTMLElement;
        // add this condition will solve issue  
        if (element) {
          element.click();
        }
      }
    });
  }

  RedirectToHistory() {
    this.router.navigate(['/request-history']);
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

