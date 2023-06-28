import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [CommonModule, AuthenticationRoutingModule]
})
export class AuthenticationModule {}
