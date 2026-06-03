import { ChangeDetectorRef, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalExampleComponent } from '../modal-example/modal-example.component';
import { NavComponent } from '../nav/nav.component';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    standalone: false
})
export class ModalComponent {

  onWillDismiss = false;
  onDidDismiss = false;

  constructor(
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) { }

  async openModal() {
    return this.open(ModalExampleComponent);
  }

  async openNav() {
    return this.open(NavComponent);
  }

  async open(TheModalComponent: any) {
    const modal = await this.modalCtrl.create({
      component: TheModalComponent,
      animated: false,
      componentProps: {
        value: '123',
        prop: '321'
      }
    });
    await modal.present();
    modal.onWillDismiss().then(() => {
      assertZoneContext();
      this.onWillDismiss = true;
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
      this.cdr.markForCheck();
    });
    modal.onDidDismiss().then(() => {
      assertZoneContext();
      if (!this.onWillDismiss) {
        throw new Error('onWillDismiss should be emitted first');
      }
      this.onDidDismiss = true;
      // Zoneless: state set in an async callback Angular does not wrap won't re-render on its own; mark the view dirty.
      this.cdr.markForCheck();
    });
  }
}
