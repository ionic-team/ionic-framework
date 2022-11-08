import { Component, Input, NgZone, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ModalController, NavParams, IonNav, ViewWillLeave, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

@Component({
  selector: 'app-modal-example',
  templateUrl: './modal-example.component.html',
})
export class ModalExampleComponent implements OnInit, ViewWillLeave, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  @Input() value?: string;

  form = new UntypedFormGroup({
    select: new UntypedFormControl([])
  });

  valueFromParams: string;
  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  modal!: HTMLElement;

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

  setSelect(value: null | undefined) {
    this.form.get('select')!.setValue(value);
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
