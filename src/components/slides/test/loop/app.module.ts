import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Slides } from '../../../../../ionic-angular';


@Component({
  templateUrl: 'main.html'
})
export class E2EPage {
  slides: any[];
  @ViewChild('loopSlider') loopSlider: Slides;
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

  onSlideChanged(slider: Slides) {
    console.log('Slide changed', slider);
  }

  ngAfterViewInit() {
    console.log(this.loopSlider);
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
