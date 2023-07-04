import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { CustomerComponent } from './customer/customer.component';
import LoginComponent from './demo/pages/authentication/login/login.component';
import { VendorComponent } from './vendor/vendor.component';
import { LogoutComponent } from './demo/pages/authentication/logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import RegisterComponent from './demo/pages/authentication/register/register.component';
import { RequestHistoryComponent } from './history/request-history/request-history.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'customer',
        redirectTo: '/customer',
        pathMatch: 'full'
      },
      {
        path: 'customer',
        component: CustomerComponent
      },
      {
        path: 'vendor',
        redirectTo: '/vendor',
        pathMatch: 'full'
      },
      {
        path: 'vendor',
        component: VendorComponent
      },
      {
        path: 'profile',
        redirectTo: '/profile',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'request-history',
        redirectTo: '/request-history',
        pathMatch: 'full'
      },
      {
        path: 'request-history',
        component: RequestHistoryComponent
      }
    ],
  },
  {
    path: '',
    loadChildren: () => import('./demo/pages/authentication/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./demo/pages/authentication/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: '',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: '',
    loadChildren: () => import('./vendor/vendor.module').then(m => m.VendorModule)
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'guest',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
