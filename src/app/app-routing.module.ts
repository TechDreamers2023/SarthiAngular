import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { CustomerComponent } from './customer/customer.component';
import LoginComponent from './demo/pages/authentication/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    
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
    
  ],
  },
  {
    path: '',
    loadChildren: () => import('./demo/pages/authentication/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
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
export class AppRoutingModule {}
