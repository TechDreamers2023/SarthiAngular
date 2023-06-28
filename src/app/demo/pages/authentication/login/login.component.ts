import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { LoginService } from 'src/app/services/acoounts/login.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {

  constructor(
    private router:Router,
    private login:LoginService,
    private toastr: ToastrService,
    private fb : FormBuilder
    )
  {  }

  logCredentials ={
    emailAddress :'',
    password:''
  }
  loginForm!: FormGroup;
  ngOnInit(): void {
    if(localStorage.getItem("UserID") != undefined){
      this.router.navigate(['/customer']);
    }
    this.loginForm =  this.fb.group({
      emailAddress: new FormControl('', [Validators.required]),
      password: new FormControl('',[Validators.required]),
    });
  }
  get emailAddress() {
    return this.loginForm.get('emailAddress');
  }
 
  get password() {
    return this.loginForm.get('password');
  }
  responces:any;
  getcall(){
    this.login.getUser(this.logCredentials)
        .subscribe(
          (response) => {                           //next() callback
            this.responces = response;
            console.log(response);
            if(this.responces.status == 1){
              if(this.responces.data[0].usertypeId === 2){
                this.toastr.success(response.message)
                localStorage.setItem("UserID",this.responces.data[0].userId);
                localStorage.setItem("User", this.responces.data[0].firstName);
                localStorage.setItem("UserName",this.responces.data[0].firstName + " "+ this.responces.data[0].firstName);
                this.router.navigate(['/customer']);

              }
            }
            if(this.responces.status == 0){
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
    onLogin(){
    
      this.getcall();
    }
}
