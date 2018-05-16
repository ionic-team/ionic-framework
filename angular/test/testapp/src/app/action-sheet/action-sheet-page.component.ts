import { Component } from '@angular/core';

import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-action-sheet-page',
  template: `
  <ion-app>
    <ion-header>
      <ion-toolbar>
        <ion-title>Action Sheet</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content padding>
      <ion-button (click)="clickMe()">Open Basic ActionSheet</ion-button>
    </ion-content>
</ion-app>
  `
})
export class ActionSheetPageComponent {

  constructor(private actionSheetController: ActionSheetController) {

  }

  async clickMe() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    return actionSheet.present();
  }

}
