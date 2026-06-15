import { Component, Input, OnInit, Optional } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ModalController, IonNav, ViewWillLeave, ViewDidEnter, ViewDidLeave } from '@ionic/angular/lazy';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
    selector: 'app-modal-example',
    templateUrl: './modal-example.component.html',
    standalone: false
})
export class ModalExampleComponent implements OnInit, ViewWillLeave, ViewDidEnter, ViewWillLeave, ViewDidLeave {

  @Input() value?: string;
  @Input() prop?: string;

  form = new UntypedFormGroup({
    select: new UntypedFormControl([])
  });

  onInit = 0;
  willEnter = 0;
  didEnter = 0;
  willLeave = 0;
  didLeave = 0;

  modal!: HTMLElement;

  constructor(
    private modalCtrl: ModalController,
    @Optional() public nav: IonNav
  ) {}

  ngOnInit() {
    assertZoneContext();
    this.onInit++;
  }

  setSelect(value: null | undefined) {
    this.form.get('select')!.setValue(value);
  }

  ionViewWillEnter() {
    if (this.onInit !== 1) {
      throw new Error('ngOnInit was not called');
    }
    assertZoneContext();
    this.willEnter++;
  }
  ionViewDidEnter() {
    assertZoneContext();
    this.didEnter++;
  }
  ionViewWillLeave() {
    assertZoneContext();
    this.willLeave++;
  }
  ionViewDidLeave() {
    assertZoneContext();
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
