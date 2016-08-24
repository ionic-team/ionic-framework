import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  reload() {
    window.location.reload();
  }
}

document.addEventListener('click', (ev: any) => {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('touchstart', (ev: any) => {
  console.log(`TOUCH START, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('touchend', (ev: any) => {
  console.log(`TOUCH END, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('focusin', (ev: any) => {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
  console.log(`FOCUS IN, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

document.addEventListener('focusout', (ev: any) => {
  console.log(`CLICK, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
  console.log(`FOCUS OUT, ${ev.target.localName}.${ev.target.className}, time: ${Date.now()}`);
});

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
