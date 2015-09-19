import {IonicView, Animation, IonicApp} from 'ionic/ionic';

import {SinkPage} from '../sink-page';


let opacity = 0.2;
let rotateZ = '180deg';
let translateX = '100px';
let scale = 0.6;


@IonicView({
  template: `
  <ion-navbar *navbar><ion-nav-items primary><button icon (click)="toggleMenu()"><i class="icon ion-navicon"></i></button></ion-nav-items><ion-title>Animation</ion-title></ion-navbar>

  <style>
    .ball-container {
      position: absolute;
      top: 300px;
      left: 20px;
      border: 1px solid gray;
      width: 300px;
      height: 51px;
    }
    .ball {
      position: absolute;
      width: 50px;
      height: 50px;
      background: blue;
    }
  </style>

  <ion-content padding>
    <h2>Animation</h2>
    <p>
      Ionic comes with a powerful Animation library based on the emerging Web Animation API. Trigger
      animations based on user actions, step (or "scrub") through during a drag gesture, or add
      realistic physics effects to your app. The Animation API is a major improvement over CSS animations.
    </p>
    <p>
      <button (click)="play($event)">Play</button>
      <button (click)="pause($event)">Pause</button>
    </p>
    <div class="ball-container">
      <div class="ball"></div>
    </div>

    <div style="position: absolute; top: 400px; left: 20px;">

      <div class="red square" style="position:absolute; width:100px; height:100px; background:red; top: 0; left: 0;"></div>
      <div class="green square" style="position:absolute; width:100px; height:100px; background:green; top: 0; left: 100px;"></div>
      <div class="blue square" style="position:absolute; width:100px; height:100px; background:blue; top: 0; left: 200px;"></div>

    </div>

    <div style="position: absolute; top: 500px; left: 20px;">

      <div class="yellow square2" style="position:absolute; width:100px; height:100px; background:yellow; top: 0; left: 0;"></div>
      <div class="purple square2" style="position:absolute; width:100px; height:100px; background:purple; top: 0; left: 100px;"></div>
      <div class="maroon square2" style="position:absolute; width:100px; height:100px; background:maroon; top: 0; left: 200px;"></div>

    </div>

    <p>
      <input type="range" (input)="progress($event)" value="0" min="0" step="0.001" max="1" style="width:200px; margin-left: 100px">
    </p>

  </ion-content>
  `
})
export class AnimationPage extends SinkPage {
  constructor(app: IonicApp) {
    super(app);

    this.animation = new Animation();

    this.animation
      .duration(2000)
      .easing('spring', { damping: 6, elasticity: 10 });


    var ball = new Animation( document.querySelector('.ball') );
    ball
      .from('translateX', '0px')
      .to('translateX', '250px')

    this.animation.add(ball);


    var row1 = new Animation( document.querySelectorAll('.square') );
    row1
      .from('opacity', 0.8)
      .to('opacity', 0.2)

    this.animation.add(row1);

    var row2 = new Animation( document.querySelectorAll('.square2') );
    row2
      .from('rotate', '0deg')
      .from('scale', '1')
      .to('rotate', '90deg')
      .to('scale', '0.5')
      .before.addClass('added-before-play')
      .after.addClass('added-after-finish')

    this.animation.add(row1, row2);

    this.animation.onReady(animation => {
      console.log('onReady', animation);
    });

    this.animation.onPlay(animation => {
      console.log('onPlay', animation);
    });

    this.animation.onFinish(animation => {
      console.log('onFinish', animation);
    });

  }

  play() {
    this.animation.play();
  }

  pause() {
    this.animation.pause();
  }

  progress(ev) {
    this.animation.progress( parseFloat(ev.srcElement.value) );
  }
}
