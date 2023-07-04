import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HistoryService } from 'src/app/services/history/history.service';

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html',
  styleUrls: ['./request-history.component.scss']
})
export class RequestHistoryComponent {

  requestData: any = [];
  userTypeId: number = 0;

  constructor(private toastr: ToastrService, private router: Router, private historyService: HistoryService) { }

  ngOnInit(): void {
    if (localStorage.getItem("UserTypeID") != undefined) {
      this.userTypeId = parseInt(localStorage.getItem("UserTypeID"));
      this.getRequestHistory();
    }
    else {
      this.router.navigate(['/login']);
    }
  }

  getRequestHistory() {
    this.historyService.getRequestHistoryById(parseInt(localStorage.getItem("UserID"))).subscribe({
      next: res => {
        if (res.status == 1) {
          if (res.data) {
            this.requestData = res.data;
            console.log(res.data);
          }
        }
        else {
          if (res.message) {
            this.toastr.error(res.message, 'Error!');
          }
        }
      },
      error: err => {
        this.toastr.error(err, 'Error!');
      }
    });
  }
}
