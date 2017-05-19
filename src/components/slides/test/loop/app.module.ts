import { Component, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  slides: any[];
  loopSlider: any;
  startingIndex: number;
  myTopSlideOptions: any;

  constructor() {
    this.slides = [
      {
        name: 'Slide 1',
        class: 'yellow'
      },
      {
        name: 'Slide 2',
        class: 'red'
      },
      {
        name: 'Slide 3',
        class: 'blue'
      }
    ];

    this.myTopSlideOptions = {
      initialSlide: 2,
      loop: true
    };

  }

  onSlideChanged(slider: any) {
    console.log('Slide changed', slider);
  }

  ngAfterViewInit() {
    console.log(this.loopSlider);
  }

}

@Component({
  template: '<ion-nav [root]="root"></ion-nav>'
})
export class AppComponent {
  root = E2EPage;
}

@NgModule({
  declarations: [
    AppComponent,
    E2EPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    E2EPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
