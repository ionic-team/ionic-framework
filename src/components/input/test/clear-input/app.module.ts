import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { IonicApp, IonicModule } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  userForm: any;
  myValue = 'really long value that overflows to show padding';

  constructor(fb: FormBuilder) {
    this.userForm = fb.group({
      username: [{value: '', disabled: false}, Validators.required],
      password: [{value: '', disabled: false}, Validators.required],
    });
  }

  clicked() {
    console.log('clicked button');
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class E2EApp {
  rootPage = E2EPage;
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
