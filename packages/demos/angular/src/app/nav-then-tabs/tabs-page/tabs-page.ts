import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'tabs-page',
  template: `
  <ion-tabs>
    <ion-tab title="Tab One" icon="star" #tabOne>
      <ion-nav [rootUrl]="tabOnePageOne" name="tab-one" lazy="true"></ion-nav>
    </ion-tab>
    <ion-tab title="Tab Two" icon="globe" #tabTwo>
      <ion-nav [rootUrl]="tabTwoPageOne" name="tab-two" lazy="true"></ion-nav>
    </ion-tab>
    <ion-tab title="Tab Three" icon="logo-facebook" #tabThree>
      <ion-nav [rootUrl]="tabThreePageOne" name="tab-three" lazy="true"></ion-nav>
    </ion-tab>
  </ion-tabs>
  `
})
export class TabsPage {

  tabOnePageOne = '/nav-then-tabs/app/tabs/(tab-one:one)';
  tabTwoPageOne = '/nav-then-tabs/app/tabs/(tab-two:one)';
  tabThreePageOne = '/nav-then-tabs/app/tabs/(tab-three:one)';

  @ViewChild('tabOne') tabOne: ElementRef;
  @ViewChild('tabTwo') tabTwo: ElementRef;
  @ViewChild('tabThree') tabThree: ElementRef;

  constructor(private router: Router, private location: Location) {
  }

  goBack() {
    window.history.back();
  }
}
