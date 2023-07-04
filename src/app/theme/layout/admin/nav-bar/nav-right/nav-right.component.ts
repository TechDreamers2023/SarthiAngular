// Angular import
import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {

  username: string = '';
  constructor() { }

  // Life cycle events
  ngOnInit(): void {
    if (localStorage.getItem("UserName") != undefined) {
      debugger
      this.username = localStorage.getItem("UserName");
    }
  }
}
