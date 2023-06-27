// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// project import
import { BreadcrumbModule, CardModule } from './components';

import { SpinnerComponent } from './components/spinner/spinner.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { PlaceAutoCompleteComponent } from './components/place-auto-complete/place-auto-complete.component';
import { MapDisplayComponent } from './components/map-display/map-display.component';
import { GoogleMapsModule } from '@angular/google-maps';

// bootstrap import
import { NgbDropdownModule, NgbNavModule, NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NavLeftComponent } from './components/nav-bar/nav-left/nav-left.component';
import { NavRightComponent } from './components/nav-bar/nav-right/nav-right.component';
import { NavLogoComponent } from './components/nav-bar/nav-logo/nav-logo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    BreadcrumbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbModule,
    NgbCollapseModule,
    NgScrollbarModule,
    GoogleMapsModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    BreadcrumbModule,
    SpinnerComponent,
    NgbModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbCollapseModule,
    NgScrollbarModule,
    GoogleMapsModule,
    PlaceAutoCompleteComponent,
    MapDisplayComponent
  ],
  declarations: [SpinnerComponent,PlaceAutoCompleteComponent,MapDisplayComponent, NavBarComponent, NavLeftComponent, NavRightComponent, NavLogoComponent]
})
export class SharedModule {}
