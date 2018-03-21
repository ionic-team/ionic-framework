import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'page-two',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Page Two</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      Page Two - {{ts}}
      <div>
        <ion-button>Go to Page Three</ion-button>
      </div>
      <div>
        <ion-button>Go Back</ion-button>
      </div>
    </ion-content>
  `
})
export class PageTwo {

}
