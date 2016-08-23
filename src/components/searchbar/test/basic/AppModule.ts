import { Component, ChangeDetectorRef, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  defaultSearch: string = 'test';
  customPlaceholder: number = 2;
  defaultCancel: string = '';

  isAutocorrect: string = 'on';
  isAutocomplete: string = 'on';
  isSpellcheck: boolean = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  onClearSearchbar(ev: any) {
    console.log('ionClear', ev.target.value);
  }

  onCancelSearchbar(ev: any) {
    console.log('ionCancel', ev.target.value);
  }

  triggerInput(ev: any) {
    console.log('ionInput', ev.target.value);
  }

  inputBlurred(ev: any) {
    console.log('ionBlur', ev.target.value);
  }

  inputFocused(ev: any) {
    console.log('ionFocus', ev.target.value);
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

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class E2EApp {
  root = E2EPage;
}

@NgModule({
  declarations: [
    E2EApp,
    E2EPage
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    E2EPage
  ]
})
export class AppModule {}
