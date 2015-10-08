import {Directive, ElementRef, FormBuilder, Validators, ControlGroup} from 'angular2/angular2';

import {App, NavController, IonicView} from 'ionic/ionic';


@IonicView({
  templateUrl: 'pages/app.html'
})
class AppPage {
  constructor(nav: NavController) {
    this.nav = nav;
  }
  doLogin() {
  }
}

@Directive({
  selector: '[parallax]',
  inputs: [
    'parallax'
  ]
})
export class ParallaxEffect {
  constructor(
    elementRef: ElementRef
  ) {
    this.ele = elementRef.nativeElement;

    setTimeout(() => {
      Object.observe(this, (changes) => {
        changes.forEach((change) => {
          if(change.name == 'parallax') {
            this.parallaxItems();
          }
        });
      });
    });
  }
  parallaxItems() {
    let list = this.ele;
    console.log('Moving items', this.parallax);
    var x = Math.max(0, (1 - this.parallax) * 20);
    var y = 0;//Math.max(0, (1 - this.parallax) * 10);
    var scale = Math.min(1, (0.9 + 0.1 * this.parallax));
    list.style['opacity'] = Math.min(this.parallax, 1);
    list.style['transform'] = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
  }
}


/**
 * Main app entry point
 */
@App({
  directives: [ParallaxEffect],
  templateUrl: 'main.html'
})
class IonicApp {
  constructor() {
    this.rootView = AppPage

    this.menuOpenAmount = 0;
  }

  onMenuOpening(amt) {
    this.menuOpenAmount = amt;
  }
}
