import { Component, OnInit } from '@angular/core';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';

/** @hidden */
export interface SelectPopoverOption {
  text: string;
  value: string;
  disabled: boolean;
  checked: boolean;
  handler?: Function;
}

/** @hidden */
@Component({
  template: `
    <ion-list radio-group [(ngModel)]="value">
      <ion-item *ngFor="let option of options">
        <ion-label>{{option.text}}</ion-label>
        <ion-radio [checked]="option.checked" [value]="option.value" [disabled]="option.disabled"></ion-radio>
      </ion-item>
    </ion-list>
  `
})
export class SelectPopover implements OnInit {

  public get value() {
    let checkedOption = this.options.find(option => option.checked);

    return checkedOption ? checkedOption.value : undefined;
  }

  public set value(value: any) {
    let checkedOption = this.options.find(option => option.value === value);
    if (checkedOption && checkedOption.handler) {
      checkedOption.handler();
    }
    this.viewController.dismiss(value);
  }

  options: SelectPopoverOption[];

  constructor(
    private navParams: NavParams,
    private viewController: ViewController
  ) { }

  public ngOnInit() {
    this.options = this.navParams.data.options;
  }
}
