import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';

const routes: Routes = [
  {
    path: 'customer',
    component: CustomerComponent
  }
];

@NgModule({
  declarations: [CustomerComponent],
  imports: [
    CommonModule,
    SharedModule, 
    NgApexchartsModule,
    RouterModule.forChild(routes)
  ]
})
export class CustomerModule { }
