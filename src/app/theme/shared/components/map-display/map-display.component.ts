import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PlaceSearchResult } from '../../../../customer/model/place-search-result';

import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { RequestViewModel } from './models/requestViewModel';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})

export class MapDisplayComponent implements OnInit {
  zoom = 5;
  @ViewChild('myGoogleMap', { static: false })
  map!: google.maps.Map;

  @Input() from: PlaceSearchResult | undefined;
  @Input() to: PlaceSearchResult | undefined;
  @Output() triggerRequestChanged = new EventEmitter<boolean>();
  markerPositions: google.maps.LatLng[] = [];
  mapOptions: google.maps.MapOptions;
  center = {
    lat: 0,
    lng: 0
  };
  markers: any = [];
  position = [];
  polylineOptions: any = {};
  currentLat: number;
  currentlong: number;
  CustomerId: number;

  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 5,
  };
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;
  infoContent = ''
  requestViewModel: RequestViewModel = new RequestViewModel();

  constructor(private customerService: CustomerService, private toastr: ToastrService,) { }

  async ngOnInit() {
    await this.getCurrentLocation();
  }

  ngOnChanges() {
    const fromLocation = this.from?.location;
    const toLocation = this.to?.location;

    if (fromLocation && toLocation) {
      // this.position=[];
      this.gotoLocation(fromLocation,"Pick Up","P");
      this.gotoLocation(toLocation,"Drop Off","D");
      this.setRoutePolyline();

      this.requestViewModel.currentlat = parseFloat(this.center.lat.toString());
      this.requestViewModel.currentlong = parseFloat(this.center.lng.toString());
      this.requestViewModel.pickuplat = parseFloat(fromLocation.lat().toString());
      this.requestViewModel.pickuplong = parseFloat(fromLocation.lng().toString());
      this.requestViewModel.dropOfflat = parseFloat(toLocation.lat().toString());
      this.requestViewModel.dropOfflong = parseFloat(toLocation.lng().toString());
      this.requestViewModel.userId = 1;

      console.log(this.requestViewModel);

      this.customerService.GenerateServiceRequest(this.requestViewModel).subscribe((response) => {
        if (response.status == 0 || response.status == 2) {
          if(this.from==undefined && this.to==undefined)
          {

            this.toastr.error(response.message)
          }
        }
        if (response.status == 1) {
          this.toastr.success(response.message)
        }
        console.log(response);
      },
        (error) => {
          this.toastr.error("Something went wrong, Please try Again ") //error() callback
        },
        () => { //complete() callback
        })
    }
  }

  gotoLocation(location: google.maps.LatLng,title:string,label:string) {
    var loc = { lat: location.lat(), lng: location.lng() }
    this.position.push(loc)
    
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
    }) 
  }

  markerDragEnd($event: any) {
  }

  getCurrentLocation() {
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
                zoom: 14
              }
              let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

              this.gotoLocation(location,"Current Location","C")
              resolve(this.center);
            }
          },
          (error) => this.toastr.error(error.message)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  setRoutePolyline() {
    this.polylineOptions = {
      path: this.position.slice(1),
      strokeColor: 'red',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };
  }
  
  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker)
  }
}
