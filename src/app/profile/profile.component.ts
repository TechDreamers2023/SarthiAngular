
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { BerryConfig } from '../app-config';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '../services/common/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  submitted = false;
  navCollapsed: boolean;
  navCollapsedMob: boolean;
  windowWidth: number;

  myForm: FormGroup = new FormGroup({
    userId: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    contactNo: new FormControl(''),
    vehicleNumber: new FormControl(''),
  });

  // Constructor
  constructor(
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private profileService: ProfileService) {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }

    if (current_url === this.location['_baseHref'] + '/layout/theme-compact' || current_url === this.location['_baseHref'] + '/layout/box')
      this.windowWidth = window.innerWidth;
    this.navCollapsed = this.windowWidth >= 1025 ? BerryConfig.isCollapse_menu : false;
    this.navCollapsedMob = false;
  }

  // Life cycle events
  ngOnInit() {
    if (localStorage.getItem("UserTypeID") != undefined) {
      this.myForm = this.formBuilder.group(
        {
          userId: [parseInt(localStorage.getItem("UserID"))],
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          password: [
            '',
            [
              Validators.required,
              Validators.minLength(6),
              Validators.maxLength(40)
            ]
          ],
          contactNo: ['', Validators.required],
          vehicleNumber: ['', Validators.required],
        }
      );

      //Bind Data...
      this.getUserProfile();
    }
    else {
      this.router.navigate(['/login']);
    }

  }
  getUserProfile() {
    this.profileService.getUserProfileById(localStorage.getItem("UserID")).subscribe({
      next: res => {
        if (res.status == 1) {
          this.myForm = this.formBuilder.group(
            {
              userId: [parseInt(localStorage.getItem("UserID"))],
              firstName: [res.data.firstName, Validators.required],
              lastName: [res.data.lastName, Validators.required],
              email: [res.data.email, [Validators.required, Validators.email]],
              password: [
                res.data.password,
                [
                  Validators.required,
                  Validators.minLength(6),
                  Validators.maxLength(40)
                ]
              ],
              contactNo: [res.data.contactNo, Validators.required],
              vehicleNumber: [res.data.vehicleNumber, Validators.required],
            }
          );
        }
        else {
          if (res.message) {
            this.toastr.error(res.message, 'Error!');
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }
  ngOnDestroy(): void {
  }

  get f(): { [key: string]: AbstractControl } {
    return this.myForm.controls;
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      this.profileService.updateUserProfile(this.myForm.value).subscribe({
        next: res => {
          if (res.status == 1) {
            localStorage.removeItem("UserName");
            localStorage.removeItem("User");

            localStorage.setItem('UserName', this.myForm.value.firstName + ' ' + this.myForm.value.lastName)
            localStorage.setItem('User', this.myForm.value.firstName)

            this.submitted = true;
            if (res.message) {
              this.toastr.success(res.message, 'Success!');
            }
          }
          else {
            if (res.message) {
              this.toastr.error(res.message, 'Error!');
            }
          }
        },
        error: err => {
          console.log(err);
        }
      });

      console.log(JSON.stringify(this.myForm.value, null, 2));
    }
    else {
      this.myForm.controls['firstName'].markAsTouched();
      this.myForm.controls['lastName'].markAsTouched();
      this.myForm.controls['email'].markAsTouched();
      this.myForm.controls['password'].markAsTouched();
      this.myForm.controls['contactNo'].markAsTouched();
      this.myForm.controls['vehicleNumber'].markAsTouched();
    }
  }

  onReset(): void {
    this.submitted = false;
    this.myForm.reset();
  }
}

