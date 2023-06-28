import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { VendorComponent } from './vendor.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

const routes: Routes = [
  {
    path: 'vendor',
    component: VendorComponent
  }
];

@NgModule({
  declarations: [VendorComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgApexchartsModule,
    RouterModule.forChild(routes)
  ]
})
export class VendorModule { }
