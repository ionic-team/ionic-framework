import { Component, Input, OnInit, Optional, signal } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ModalController, IonNav, ViewWillLeave, ViewDidEnter, ViewDidLeave } from '@ionic/angular';

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

  // Signals so state set from Ionic lifecycle hooks renders under the
  // OnPush-by-default change detection introduced in Angular 22.
  onInit = signal(0);
  willEnter = signal(0);
  didEnter = signal(0);
  willLeave = signal(0);
  didLeave = signal(0);

  modal!: HTMLElement;

  constructor(
    private modalCtrl: ModalController,
    @Optional() public nav: IonNav
  ) {}

  ngOnInit() {
    assertZoneContext();
    this.onInit.update((value) => value + 1);
  }

  setSelect(value: null | undefined) {
    this.form.get('select')!.setValue(value);
  }

  ionViewWillEnter() {
    if (this.onInit() !== 1) {
      throw new Error('ngOnInit was not called');
    }
    assertZoneContext();
    this.willEnter.update((value) => value + 1);
  }
  ionViewDidEnter() {
    assertZoneContext();
    this.didEnter.update((value) => value + 1);
  }
  ionViewWillLeave() {
    assertZoneContext();
    this.willLeave.update((value) => value + 1);
  }
  ionViewDidLeave() {
    assertZoneContext();
    this.didLeave.update((value) => value + 1);
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
