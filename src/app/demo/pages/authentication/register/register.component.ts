import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterClientService } from 'src/app/services/accounts/register-client.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
    registerForm: any;


    constructor(private router:Router,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private register : RegisterClientService,
      ){    }

      registerClientObj = {
        "firstName": "",
        "lastName" :" ",
        "email":"",
        "contactNo":"",
        "vehicleNumber":"",
        "password":"",
      }

    ngOnInit(): void {
      this.registerForm = this.fb.group({
        FirstName: new FormControl('', [Validators.required]),
        LastName: new FormControl('', [Validators.required]),
        Email: new FormControl('', Validators.compose([Validators.required,Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')])),
        Contact: new FormControl('', Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])),
        VehicleNumber: new FormControl('', [Validators.required]),
        Password: new FormControl('', [Validators.required]),
        ConfirmPassword: new FormControl('', [Validators.required])
      },{validator: this.checkIfMatchingPasswords('Password', 'ConfirmPassword')});
    }
    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
      return (group: FormGroup) => {
        let passwordInput = group.controls[passwordKey],
            passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value) {
          return passwordConfirmationInput.setErrors({notEquivalent: true})
        }
        else {
            return passwordConfirmationInput.setErrors(null);
        }
      }
    }
   

    responces: any;

    registerClient() {debugger
      this.register.registerClients(this.registerClientObj)
        .subscribe(
          (response) => {                           //next() callback
            this.responces = response;
            console.log(response);
            if (this.responces.status == 1) {
              this.toastr.success(response.message);
              this.router.navigate(['/login']);
            }
            if (this.responces.status == 0 || this.responces.status == 2) {
              this.toastr.error(response.message)
            }
          },
          (error) => {
            this.toastr.error("Something went wrong, Please try Again ")                    //error() callback
            console.log("Something went wrong")
          },
          () => {                                   //complete() callback
            console.log("Completed")
          })
    }

}
