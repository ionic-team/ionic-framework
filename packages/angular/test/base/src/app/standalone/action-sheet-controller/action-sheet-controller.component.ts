import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-action-sheet-controller',
  templateUrl: './action-sheet-controller.component.html',
  standalone: true
})
export class ActionSheetControllerComponent {
  registeredMenuCount = 0;

  constructor(private actionSheetCtrl: ActionSheetController) {}

  async openActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: ['Button']
    });

    await actionSheet.present();
  }
}
