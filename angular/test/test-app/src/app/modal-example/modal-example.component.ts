import { Component, Input, NgZone, OnInit, Optional } from '@angular/core';
import { ModalController, NavParams, IonNav } from '@ionic/angular';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
})
export class ModalExampleComponent implements OnInit {

  @Input() value: string;

  valueFromParams: string;
  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  constructor(
    private modalCtrl: ModalController,
    @Optional() public nav: IonNav,
    navParams: NavParams
  ) {
    this.valueFromParams = navParams.get('prop');
  }

  ngOnInit() {
    NgZone.assertInAngularZone();
    this.onInit++;
  }

  ionViewWillEnter() {
    if (this.onInit !== 1) {
      throw new Error('ngOnInit was not called');
    }
    NgZone.assertInAngularZone();
    this.willEnter++;
  }
  ionViewDidEnter() {
    NgZone.assertInAngularZone();
    this.didEnter++;
  }
  ionViewWillLeave() {
    NgZone.assertInAngularZone();
    this.willLeave++;
  }
  ionViewDidLeave() {
    NgZone.assertInAngularZone();
    this.didLeave++;
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  push() {
    this.nav.push(ModalExampleComponent, {
      'value': 'pushed!'
    });
  }
  pop() {
    this.nav.pop();
  }
}
