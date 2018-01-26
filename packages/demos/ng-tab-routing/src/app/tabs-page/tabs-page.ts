import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'tabs-page',
  template: `
  <ion-tabs (ionChange)="tabChanged($event)">
    <ion-tab title="Tab One" icon="star" #tabOne>
      <ion-nav [root]="tabOnePageOne" name="tab-one"></ion-nav>
    </ion-tab>
    <ion-tab title="Tab Two" icon="globe" #tabTwo>
      <ion-nav [root]="tabTwoPageOne" name="tab-two" lazy="true"></ion-nav>
    </ion-tab>
    <ion-tab title="Tab Three" icon="logo-facebook" #tabThree>
      <ion-nav [root]="tabThreePageOne" name="tab-three" lazy="true"></ion-nav>
    </ion-tab>
  </ion-tabs>
  `
})
export class TabsPage {

  tabOnePageOne = '/app/tabs/(tab-one:one)';
  tabTwoPageOne = '/app/tabs/(tab-two:one)';
  tabThreePageOne = '/app/tabs/(tab-three:one)';

  @ViewChild('tabOne') tabOne: ElementRef;
  @ViewChild('tabTwo') tabTwo: ElementRef;
  @ViewChild('tabThree') tabThree: ElementRef;

  constructor(/*private navController: NavController*/private router: Router, private location: Location) {
  }



  pushPageThree() {
    this.router.navigateByUrl('/page-three');
  }

  goBack() {
    window.history.back();
  }

  tabChanged(event: Event) {
    /*const tabs = event.target as HTMLIonTabsElement;
    return (tabs as any).componentOnReady().then(() => {
      const selected = tabs.getSelected();
      if (selected === this.tabOne.nativeElement) {
        return this.router.navigateByUrl('/app/tabs/(tab-one:one)');
      } else if (selected === this.tabTwo.nativeElement) {
        return this.router.navigateByUrl('/app/tabs/(tab-two:one)');
      } else {
        return this.router.navigateByUrl('/app/tabs/(tab-three:one)');
      }
    });
    */
  }
}
