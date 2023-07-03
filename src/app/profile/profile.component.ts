
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';
import { BerryConfig } from '../app-config';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileForm } from '../vendor/model/place-search-result';

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

  form: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    acceptTerms: new FormControl(false),
  }); 


  // Constructor
  constructor(
    private location: Location,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder) {
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
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue]
      } 
    );
  }

  ngOnDestroy(): void {
  }
 
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }
}

