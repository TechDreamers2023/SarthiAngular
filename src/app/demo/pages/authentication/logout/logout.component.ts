import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router : Router,
    private toastr: ToastrService,) {}
  ngOnInit(){debugger
    this.toastr.success("Logout Suucessfully");  
  localStorage.clear();
  this.router.navigate(['/login']);
}
}
