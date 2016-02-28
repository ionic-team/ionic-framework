import {App, IonicApp} from 'ionic-angular';

@App({
  templateUrl: 'main.html'
})
class MyApp {
  constructor(app: IonicApp) {
    this.app = app;

    this.slides = [
      {
        name: "Slide 1",
        class: "yellow"
      },
      {
        name: "Slide 2",
        class: "red"
      },
      {
        name: "Slide 3",
        class: "blue"
      }
    ];

    this.startingIndex = 2;

    this.myTopSlideOptions = {
      index: this.startingIndex,
      loop: true
    };
  }

  onSlideChanged(slider) {
    console.log('Slide changed', slider);
    console.log("active index", slider.activeIndex);
  }

  ngOnInit() {
    setTimeout(() => {
      this.slider = this.app.getComponent('loopSlider');
      console.log('Got slider', this.slider);
    });
  }
}
