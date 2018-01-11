import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  template: `
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home Page</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Home Page Content
      <ion-button (click)="navigate()">Go to Page Two</ion-button>
    </ion-content>
  </ion-page>
  `
})
export class HomePageComponent implements OnInit {

  @HostBinding('class') classes = 'ion-page';
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate() {
    this.router.navigateByUrl('/second');
  }

}
