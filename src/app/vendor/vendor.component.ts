// Angular Import
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';

import { Location, LocationStrategy } from '@angular/common';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// Bootstrap Import
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

// third party
import ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexGrid,
  ApexStroke,
  ApexTooltip
} from 'ng-apexcharts';
import { BerryConfig } from '../app-config';
import { PlaceSearchResult } from './model/place-search-result';
import { VendorService } from '../services/vendors/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  // imports: [CommonModule, SharedModule, NgApexchartsModule],
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent {

  fromvalue: PlaceSearchResult | undefined;
  tovalue: PlaceSearchResult | undefined;

  IsShiftStarted: boolean = false;
  timerSubscription!: any;
  vendorStatusSubscription!: any;

  navCollapsed: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;

  timeLeft: number = 3600;
  subscribeTimer: any;

  requestData: any = {
    currentStageId: 0,
    customerContactNo: "",
    customerFirstName: "",
    customerId: 1,
    customerLastName: "",
    distanceKM: 0,
    dropOffLatitude: 0,
    dropOffLocation: "",
    dropOffLongitude: 0,
    durationInMins: "",
    isCustomerAccepted: true,
    isRejectedByVendor: false,
    pickUpLocation: "",
    pickupLatitude: 0,
    pickupLongitude: 0,
    quoationDetailId: 0,
    requestExpireTime: "",
    requestId: 0,
    requestNumber: "",
    totalAmount: 0,
    vehicleNumber: "",
    vendorContactNo: "",
    vendorFirstName: "",
    vendorLastName: "",
    vendorLatitude: 0,
    vendorLongitude: 0,
  }
  // Constructor
  constructor(private zone: NgZone, private location: Location,
    private locationStrategy: LocationStrategy,
    private vendorService: VendorService,
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

  // Life cycle events
  ngOnInit(): void {
    if (localStorage.getItem("UserTypeID") != undefined) {
      if (localStorage.getItem('UserTypeID') == '2') {
        this.router.navigate(['/customer']);
      }
      else {
        //Check shift status..
        this.getShiftStatus();
      }
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  observableTimer() {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.timerSubscription);
    clearInterval(this.vendorStatusSubscription);
  }

  getShiftStatus() {
    this.vendorService.getShiftStatus().subscribe({
      next: res => {
        if (res.data == null) {
          this.IsShiftStarted = false;
          localStorage.removeItem('_shiftId');
          clearInterval(this.timerSubscription);
          clearInterval(this.vendorStatusSubscription);
        }
        else {
          this.IsShiftStarted = true;
          localStorage.setItem('_shiftId', res.data);
          this.saveVendorLocation();
          this.getGetVendorActiveRequest()
          this.timerSubscription = setInterval(() => {
            const res =
              this.saveVendorLocation();
          }, 3000);

          this.vendorStatusSubscription = setInterval(() => {
            const res =
              this.getGetVendorActiveRequest();
          }, 3000);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getGetVendorActiveRequest() {
    this.vendorService.getGetVendorActiveRequest().subscribe({
      next: res => {
        if (res.status == 1) {
          if (res.data) {
            this.requestData = res.data;
            console.log("Request Data", res.data);
            this.observableTimer();
          }
        }
        else {
          this.requestData = null;
          // if (res.message) {
          //   this.toastr.error(res.message, 'Error!');
          // }
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  saveVendorLocation() {
    const data = {
      vendorId: localStorage.getItem("UserID"),
      currentLatitude: 0,
      currentLongitude: 0,
      shiftId: localStorage.getItem("_shiftId"),
      requestId: 1
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            data.currentLatitude = position.coords.latitude
            data.currentLongitude = position.coords.longitude
            this.vendorService.saveVendorLocation(data).subscribe();
          }
        }
      );
    }
  }

  manageShift() {
    this.vendorService.manageShift().subscribe({
      next: res => {
        if (res.status == 1) {
          this.getShiftStatus();
          this.toastr.success(res.message, 'Success!');

        }
        else {
          this.toastr.error(res.message, 'Error!');
        }
      },
      error: err => {
        this.toastr.error('Something went wrong... Please try again!', 'Error!');
      }
    });
  }

  rejectQuotation() {
    this.vendorService.rejectQuotation({ vendorId: parseInt(localStorage.getItem('UserID')), quoationDetailedId: this.requestData.quoationDetailId }).subscribe({
      next: res => {
        if (res.status == 1) {
          this.getGetVendorActiveRequest();
          this.toastr.success(res.message, 'Success!');
        }
        else if (res.message) {
          this.toastr.error(res.message, 'Error!');
        }
      },
      error: err => {
        this.toastr.error('Something went wrong... Please try again!', 'Error!');
      }
    });
  }

  accceptQuotation() {
    this.vendorService.accceptQuotation({ vendorId: parseInt(localStorage.getItem('UserID')), quoationDetailedId: this.requestData.quoationDetailId }).subscribe({
      next: res => {
        if (res.status == 1) {
          this.getGetVendorActiveRequest();
          this.toastr.success(res.message, 'Success!');
        }
        else if (res.message) {
          this.toastr.error(res.message, 'Error!');
        }
      },
      error: err => {
        this.toastr.error('Something went wrong... Please try again!', 'Error!');
      }
    });
  }

  changeStatus(_stage: number) {
    this.vendorService.UpdateRequestStatus({ requestId: this.requestData.requestId, userId: parseInt(localStorage.getItem('UserID')), stageId: _stage }).subscribe({
      next: res => {
        if (res.status == 1) {
          this.getGetVendorActiveRequest();
          this.toastr.success(res.message, 'Success!');
        }
        else if (res.message) {
          this.toastr.error(res.message, 'Error!');
        }
      },
      error: err => {
        this.toastr.error('Something went wrong... Please try again!', 'Error!');
      }
    });
  }
}
