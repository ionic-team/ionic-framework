import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  defaultSearch: string = 'test';
  customPlaceholder: number = 2;
  defaultCancel: string = '';

  isAutocorrect: string = 'on';
  isAutocomplete: string = 'on';
  isSpellcheck: boolean = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  onClearSearchbar(ev: any) {
    console.log('ionClear', ev.value);
  }

  onCancelSearchbar(ev: any) {
    console.log('ionCancel', ev.value);
  }

  triggerInput(ev: any) {
    console.log('ionInput', ev.value);
  }

  inputBlurred(ev: any) {
    console.log('ionBlur', ev.value);
  }

  inputFocused(ev: any) {
    console.log('ionFocus', ev.value);
  }

  ngAfterViewInit() {
    this.customPlaceholder = 33;
    this.defaultCancel = 'after view';
    this.changeDetectorRef.detectChanges();
  }

  changeValue() {
    this.defaultSearch = 'changed';
  }
}
