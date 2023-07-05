import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ProfileComponent } from '../profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestHistoryComponent } from './request-history/request-history.component';

const routes: Routes = [
  {
    path: 'vendor',
    component: RequestHistoryComponent
  }
];

@NgModule({
  declarations: [RequestHistoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgApexchartsModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class VendorModule { }
