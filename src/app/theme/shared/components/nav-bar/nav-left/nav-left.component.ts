import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./nav-left.component.scss']
})
export class NavLeftComponent {
  @Output() onNavCollapsedMob = new EventEmitter();
  navCollapsedMob;
  headerStyle: string;
  menuClass: boolean;
  collapseStyle: string;
  
  constructor() {
    this.navCollapsedMob = false;
    this.headerStyle = '';
    this.menuClass = false;
    this.collapseStyle = 'none';
  }
}
