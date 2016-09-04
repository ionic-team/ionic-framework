import { Component, ViewChild, NgModule } from '@angular/core';
import { IonicApp, IonicModule, Slides } from '../../../..';


@Component({
  templateUrl: 'main.html'
})
export class E2EApp {
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

@NgModule({
  declarations: [
    E2EApp
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp
  ]
})
export class AppModule {}
