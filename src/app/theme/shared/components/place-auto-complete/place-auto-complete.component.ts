import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild,ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceSearchResult } from '../../../../customer/model/place-search-result'; 
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-place-auto-complete',
  templateUrl: './place-auto-complete.component.html',
  styleUrls: ['./place-auto-complete.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PlaceAutoCompleteComponent implements OnInit {

  @ViewChild('InputFrom')
  inputField!: ElementRef;

  @Output() placeChanged = new EventEmitter<PlaceSearchResult>();
  @Output() triggerPlaceChanged = new EventEmitter<string>();
  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor(
    private ngZone: NgZone,
    private customerService: CustomerService) { }

  @Input() placeholder = '';

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();

      const result: PlaceSearchResult = {
        address: this.inputField.nativeElement.value,
        location: place?.geometry?.location
      } 

      this.ngZone.run(() => {
        this.placeChanged.emit(result);
        this.triggerPlaceChanged.emit("location added");
      });
    });
  }
}
