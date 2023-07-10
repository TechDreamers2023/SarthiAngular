import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PlaceSearchResult, RequestViewModel, VPlaceSearchResult, VendorsPlaceSearchResult } from '../../../../customer/model/place-search-result';
import { GoogleMap, MapDirectionsService, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { map } from 'rxjs';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
 
@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})

export class MapDisplayComponent implements OnInit {
  zoom = 50;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap; 
  @Input() stageId: number = 0;
  @Input() from: PlaceSearchResult | undefined;
  @Input() to: PlaceSearchResult | undefined;
  @Input() vendor: VendorsPlaceSearchResult  | undefined;
  @Input() distance : number = 0;
  @Output() triggerRequestChanged = new EventEmitter<any>();
   
  markerPositions: google.maps.LatLng[] = [];
  mapOptions: google.maps.MapOptions;
  center = {
    lat: 0,
    lng: 0
  };
  isPermissionEnabled = true;
  markers: any = [];
  position = [];
  polylineOptions: any = {};
  currentLat: number;
  currentlong: number;
  CustomerId: number;
  Coordinates = []; 
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 15,
    maxZoom:20
  };
  info!: MapInfoWindow;
  infoContent = ''
  requestViewModel: RequestViewModel = new RequestViewModel();

  constructor(
    private directionService: MapDirectionsService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private modalService: NgbModal ) {
  }
  
  ngOnChanges() {
    const fromLocation = this.from?.location;
    const toLocation = this.to?.location;

    if (fromLocation) {
      this.gotoLocation(fromLocation,"Pick Up","P");
    }

    if (toLocation) {
      this.gotoLocation(toLocation,"Drop Off","D");
    }  

    if(this.vendor.vendors != undefined && this.vendor.vendors.length > 0){
      this.vendor.vendors.forEach(element => {
        this.gotoLocation(element.location,"Vendor",element.name);
        });
    }  

    if (fromLocation && toLocation) {
      //Hide due to  multiple selection
      this.setRoutePolyline();

      if(this.stageId == 0)  {
      this.requestViewModel.currentlat = parseFloat(this.center.lat.toString());
      this.requestViewModel.currentlong = parseFloat(this.center.lng.toString());
      this.requestViewModel.pickuplat = parseFloat(fromLocation.lat().toString());
      this.requestViewModel.pickuplong = parseFloat(fromLocation.lng().toString());
      this.requestViewModel.dropOfflat = parseFloat(toLocation.lat().toString());
      this.requestViewModel.dropOfflong = parseFloat(toLocation.lng().toString());
      this.requestViewModel.userId = this.CustomerId;

      this.customerService.GenerateServiceRequest(this.requestViewModel).subscribe((response) => {
        if (response.status == 0 || response.status == 2) {
          var info = {
            isSuccess: false,
            message: response.message
        }
          this.triggerRequestChanged.emit(info);
        }
        if (response.status == 1) { 
          var info = {
            isSuccess: true,
            message: response.message
          }
          this.triggerRequestChanged.emit(info);
          localStorage.setItem("RequestStatus","1");
        }
       },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ") //error() callback
        },
        () => { //complete() callback
        })
      }
    }
  }

  gotoLocation(location: google.maps.LatLng,title:string,label:string) {
    var loc = { lat: location.lat(), lng: location.lng() }
    this.position.push(loc)
    this.map.panTo(location);
    this.markers.push({
      position: loc,
      label: {
        color: 'black',
        fontFamily: "'Domine', serif",
        fontWeight:"bold",
        text: label,
      },
      title: title,
      info: title,
      zoomControl: true,
      scrollwheel: true,
      center: this.center,
      zoom: (this.distance > 0 ? (this.distance <  13 ? 11 : 13 ) : 17),
    })  
  }

  async ngOnInit() {
    this.CustomerId  = +localStorage.getItem("UserID");
    await this.getCurrentLocation();
    console.log(this.distance);
  }

  getCurrentLocation() {debugger
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              this.mapOptions = {
                center: this.center,
                zoom: (this.distance > 0 ? (this.distance <  13 ? 11 : 13 ) : 17),
                zoomControl: true,
                scrollwheel: true,
              }

              let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
              this.isPermissionEnabled = true;
              this.gotoLocation(location,"Current Location","C")
              resolve(this.center);
            }
          },
          (error) => {debugger
            // this.toastr.error(error.message)
          this.isPermissionEnabled = false;
          let element: HTMLElement = document.getElementById('modelPermission') as HTMLElement;
          // add this condition will solve issue  
          if (element) {
            element.click();
          }
          console.log(this.isPermissionEnabled);
        }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  setRoutePolyline() {
     const fromLocationlat = this.from?.location.lat();
     const fromLocationlong = this.from?.location.lng();
      const toLocationlat = this.to?.location.lat();
      const toLocationlong = this.to?.location.lng();

     this.Coordinates = [
      { lat: fromLocationlat,lng : fromLocationlong},
      { lat: toLocationlat, lng : toLocationlong },
     ]; 

    this.polylineOptions = {
      path: this.stageId > 0 ? this.Coordinates : this.position,
      strokeColor: 'blue',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      geodesic: true,
    };
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }

  open(content: any) {
    this.modalService.open(content, { 
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
     }).result.then((result) => {
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
