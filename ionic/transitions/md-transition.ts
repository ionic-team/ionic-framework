import {Transition, ViewTransition} from './transition';
import {Animation} from '../animations/animation';

const TRANSLATE_Y = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px'


class MDTransition extends Transition {

  constructor(navCtrl, opts) {
    opts.renderDelay = 160;
    super(navCtrl, opts, MDEnteringTransition, MDLeavingTransition);
  }

}

class MDEnteringTransition extends ViewTransition {

  constructor(navCtrl, viewCtrl, opts) {
    super(navCtrl, viewCtrl, opts);

    // entering item moves in bottom to center
    this.content
      .to(TRANSLATE_Y, CENTER)
      .before.setStyles({ zIndex: viewCtrl.index });

    // entering item moves in bottom to center
    this.navbar
      .to(TRANSLATE_Y, CENTER)
      .fadeIn()
      .before.addClass('show-navbar')
      .before.setStyles({ zIndex: viewCtrl.index + 10 });

    if (viewCtrl.enableBack()) {
      this.backButton.before.addClass('show-back-button');
    }

    // set properties depending on direction
    if (opts.direction === 'back') {
      this.duration(200).easing('cubic-bezier(0.47,0,0.745,0.715)');

      // back direction
      this.content
        .from(TRANSLATE_Y, CENTER);

      this.navbar
        .from(TRANSLATE_Y, CENTER);

    } else {
      // forward direction
      this.duration(280).easing('cubic-bezier(0.36,0.66,0.04,1)');

      this.content
        .from(TRANSLATE_Y, OFF_BOTTOM)
        .fadeIn();

      this.navbar
        .from(TRANSLATE_Y, OFF_BOTTOM)
        .fadeIn();
    }

    let viewLength = navCtrl.length();
    if ((viewLength === 1 || viewLength === 2) && navCtrl.tabs) {
      let tabBarEle = navCtrl.tabs.elementRef.nativeElement.querySelector('ion-tab-bar-section');
      let tabBar = new Animation(tabBarEle);

      if (viewLength === 1 && opts.direction == 'back') {
        tabBar.fromTo('height', '0px', '69px');
        tabBar.fadeIn();

      } else if (viewLength === 2 && opts.direction == 'forward') {
        tabBar.fromTo('height', '69px', '0px');
        tabBar.fadeOut();
      }

      this.add(tabBar);
    }

  }

}

class MDLeavingTransition extends ViewTransition {

  constructor(navCtrl, viewCtrl, opts) {
    super(navCtrl, viewCtrl, opts);

    // leaving viewCtrl stays put
    this.content
      .before.setStyles({ zIndex: viewCtrl.index })
      .after.removeClass('show-view');

    this.navbar
      .before.setStyles({ zIndex: viewCtrl.index + 10 })
      .after.removeClass('show-navbar')
      .fadeOut();

    // set properties depending on direction
    if (opts.direction === 'back') {
      this.duration(200).easing('cubic-bezier(0.47,0,0.745,0.715)');

      // leaving viewCtrl goes center to bottom
      this.content
        .fromTo(TRANSLATE_Y, CENTER, OFF_BOTTOM)
        .fadeOut();

      this.navbar
        .fromTo(TRANSLATE_Y, CENTER, OFF_BOTTOM)
        .fadeOut();
    }

    let viewLength = navCtrl.length();
    if ((viewLength === 1 || viewLength === 2) && navCtrl.tabs) {
      let tabBarEle = navCtrl.tabs.elementRef.nativeElement.querySelector('ion-tab-bar-section');
      let tabBar = new Animation(tabBarEle);

      if (viewLength === 1 && opts.direction == 'back') {
        tabBar.fromTo('height', '0px', '69px');
        tabBar.fadeIn();

      } else if (viewLength === 2 && opts.direction == 'forward') {
        tabBar.fromTo('height', '69px', '0px');
        tabBar.fadeOut();
      }

      this.add(tabBar);
    }

  }

}

Transition.register('md', MDTransition);
