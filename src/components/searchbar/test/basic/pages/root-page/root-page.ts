import { ChangeDetectorRef, Component } from '@angular/core';
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
  activeTab = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  onClearSearchbar(ev: any) {
    console.log('ionClear', ev);
  }

  onCancelSearchbar(ev: any) {
    console.log('ionCancel', ev);
  }

  triggerInput(ev: any) {
    console.log('ionInput', ev);
  }

  changedInput(ev: any) {
    console.log('ionChange', ev);
  }

  inputBlurred(ev: any) {
    console.log('ionBlur', ev);
  }

  inputFocused(ev: any) {
    console.log('ionFocus', ev);
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
