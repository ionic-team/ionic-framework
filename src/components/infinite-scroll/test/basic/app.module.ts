import { Component, NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScroll, IonicApp, IonicModule,  NavController } from '../../../..';


@Component({
  selector: 'my-content',
  templateUrl: 'main.html'
})
export class MyContent {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  items: number[] = [];
  enabled: boolean = true;

  constructor(public navCtrl: NavController) {
    for (var i = 0; i < 30; i++) {
      this.items.push( this.items.length );
    }
  }

  doInfinite(): Promise<any> {
    console.log('Begin async operation');

    return getAsyncData().then(newData => {
      for (var i = 0; i < newData.length; i++) {
        this.items.push( this.items.length );
      }

      console.log('Finished receiving data, async operation complete');

      if (this.items.length > 90) {
        this.enabled = false;
      }
    });
  }

  goToPage2() {
    this.navCtrl.push(E2EPage2);
  }

  toggleInfiniteScroll() {
    this.enabled = !this.enabled;
  }
}


@Component({
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Infinite Scroll</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <my-content></my-content>
  </ion-content>
`
})
export class E2EPage1 {}


@Component({
  template: '<ion-content><button ion-button (click)="navCtrl.pop()">Pop</button></ion-content>'
})
export class E2EPage2 {
  constructor(public navCtrl: NavController) {}
}


@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = E2EPage1;
}

@NgModule({
  declarations: [
    AppComponent,
    E2EPage1,
    E2EPage2,
    MyContent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    E2EPage1,
    E2EPage2,
    MyContent
  ]
})
export class AppModule {}


function getAsyncData(): Promise<any[]> {
  // async return mock data
  return new Promise(resolve => {

    setTimeout(() => {
      let data: number[] = [];
      for (var i = 0; i < 30; i++) {
        data.push(i);
      }

      resolve(data);
    }, 500);

  });
}
