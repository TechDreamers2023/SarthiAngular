import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PlaceSearchResult } from '../../../../customer/model/place-search-result';
import { GoogleMap, MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs';


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

  markerPositions: google.maps.LatLng[] = [];
  currentlatitude!: number;
  currentlongitude!: number;

  center = {
    lat: 0,
    lng:0
  };

  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 15,
  };

  constructor(private directionService: MapDirectionsService) {

  }

 ngOnChanges() {
    const fromLocation = this.from?.location;
     if (fromLocation) {
      this.gotoLocation(fromLocation);
    } 
  }

  gotoLocation(location: google.maps.LatLng) {
    console.log(location);
    this.markerPositions = [location];
    this.map.panTo(location);
    this.zoom = 17;
    
   }
 

  async ngOnInit() {
    const position: any = await this.getCurrentLocation();
    this.gotoLocation(position);
    // this.currentlatitude = position.coords.latitude;
    // this.currentlongitude = position.coords.latitude;
  }

  markerDragEnd($event: any) {
    console.log('dragEnd');
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
              
              resolve(this.center);
            }
          },
          (error) => console.log(error)
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  
} 
