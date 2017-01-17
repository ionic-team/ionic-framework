import { Component, NgModule } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonicApp, IonicModule } from '../../../../../ionic-angular';



@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  stackedCtrl = new FormControl('1994-12-15T13:47:20.789');
  floatingCtrl = new FormControl('1995-04-15');
  fixedCtrl = new FormControl({value: '2002-09-23T15:03:46.789', disabled: true});
  inlineCtrl = new FormControl({value: '2005-06-17T11:06Z', disabled: true});

  datetimeForm = new FormGroup({
    'stacked': this.stackedCtrl,
    'floating': this.floatingCtrl,
    'fixed': this.fixedCtrl,
    'inline': this.inlineCtrl
  });

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
    E2EPage
  ]
})
export class AppModule {}
