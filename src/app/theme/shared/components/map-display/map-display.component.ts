import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PlaceSearchResult, RequestViewModel } from '../../../../customer/model/place-search-result';
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
  styleUrls: ['./map-display.component.css']
})

export class MapDisplayComponent implements OnInit {
  zoom = 5;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;

  @Input() from: PlaceSearchResult | undefined;
  @Input() to: PlaceSearchResult | undefined;
  @Output() triggerRequestChanged = new EventEmitter<boolean>();
  markerPositions: google.maps.LatLng[] = [];
  mapOptions: google.maps.MapOptions;
  center = {
    lat: 0,
    lng: 0
  };

  markers: any = {};
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

  requestViewModel: RequestViewModel = new RequestViewModel();

  constructor(
    private directionService: MapDirectionsService,
    private customerService: CustomerService,
    private toastr: ToastrService) {
  }

  ngOnChanges() {
    const fromLocation = this.from?.location;
    const toLocation = this.to?.location;

    if (fromLocation) {
      this.gotoLocation(fromLocation);
    }

    if (toLocation) {
      this.gotoLocation(toLocation);
    }

    if (fromLocation && toLocation) {
      this.setRoutePolyline();
      this.requestViewModel.currentlat = parseFloat(this.center.lat.toString());
      this.requestViewModel.currentlong = parseFloat(this.center.lng.toString());
      this.requestViewModel.pickuplat = parseFloat(fromLocation.lat().toString());
      this.requestViewModel.pickuplong = parseFloat(fromLocation.lng().toString());
      this.requestViewModel.dropOfflat = parseFloat(toLocation.lat().toString());
      this.requestViewModel.dropOfflong = parseFloat(toLocation.lng().toString());
      this.requestViewModel.userId = 1;

      this.customerService.GenerateServiceRequest(this.requestViewModel).subscribe((response) => {
        if (response.status == 0 || response.status == 2) {
          this.toastr.error(response.message)
        }
        if (response.status == 1) {
          this.toastr.success(response.message)
          this.triggerRequestChanged.emit(true);
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

  gotoLocation(location: google.maps.LatLng) {
    var loc = { lat: location.lat(), lng: location.lng() }
    this.position.push(loc)
    this.map.panTo(location);
    this.markers = {
      position: this.position,
      zoom: 5,
      zoomControl: true,
      scrollwheel: true,
    }
  }

  async ngOnInit() {
    await this.getCurrentLocation();
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
                zoom: 17,
                zoomControl: true,
                scrollwheel: true,
              }

              let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

              this.gotoLocation(location)
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
      strokeColor: 'blue',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };
  }
} 
