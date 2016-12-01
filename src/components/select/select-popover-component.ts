import { Component, OnInit } from '@angular/core';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';

/** @private */
export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
}

/** @private */
@Component({
  template: `
    <ion-list radio-group [(ngModel)]="value">
      <ion-item *ngFor="let option of options; let i = index">
        <ion-label>{{option.text}}</ion-label>
        <ion-radio [checked]="option.checked" [value]="option.value" [disabled]="option.disabled"></ion-radio>
      </ion-item>
    </ion-list>
  `
})
export class SelectPopover implements OnInit {

  public get value() {
    return this.options.find(option => option.checked).value;
  }

  public set value(value: any) {
    this.viewController.dismiss(value);
  }

  private options: SelectPopoverOption[];

  constructor(
    private navParams: NavParams,
    private viewController: ViewController
  ) { }

  public ngOnInit() {
    this.options = this.navParams.data.options;
  }
}
