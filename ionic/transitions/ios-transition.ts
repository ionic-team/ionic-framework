import {Transition, ViewTransition} from './transition';
import {Animation} from '../animations/animation';

const DURATION = 550;
const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';

const OPACITY = 'opacity';
const TRANSLATEX = 'translateX';

const OFF_LEFT = '-33%';
const CENTER = '0%'
const OFF_OPACITY = 0.8;


class IOSTransition extends Transition {

  constructor(navCtrl, opts) {
    super(navCtrl, opts, IOSEnteringTransition, IOSLeavingTransition);

    this.duration(DURATION);
    this.easing(EASING);
  }

}

class IOSEnteringTransition extends ViewTransition {

  constructor(navCtrl, viewCtrl, opts) {
    super(navCtrl, viewCtrl, opts);

    this.content
      .to(TRANSLATEX, CENTER)
      .to(OPACITY, 1)
      .before.setStyles({ zIndex: viewCtrl.index });

    this.navbar.before.addClass('show-navbar');

    this.title
      .fadeIn()
      .to(TRANSLATEX, CENTER);

    this.navbarBg
      .to(TRANSLATEX, CENTER);

    this.navbarItems
      .fadeIn();

    if (viewCtrl.enableBack()) {
      this.backButton
        .before.addClass('show-back-button')
        .fadeIn();
    }

    // set properties depending on direction
    if (opts.direction === 'back') {
      // back direction
      this.content
        .from(TRANSLATEX, OFF_LEFT)
        .from(OPACITY, OFF_OPACITY)
        .to(OPACITY, 1);

      this.title
        .from(TRANSLATEX, OFF_LEFT);

      this.navbarBg
        .from(TRANSLATEX, OFF_LEFT);

    } else {
      // forward direction
      this.content
        .from(TRANSLATEX, '99.5%')
        .from(OPACITY, 1);

      this.title
        .from(TRANSLATEX, '99.5%');

      this.navbarBg
        .from(TRANSLATEX, '99.5%')
        .fadeIn();

      if (viewCtrl.enableBack()) {
        let backBtnText = new Animation(viewCtrl.backBtnTextRef());
        backBtnText.fromTo(TRANSLATEX, (300) + 'px', CENTER);
        this.navbar.add(backBtnText);
      }
    }

  }

}

class IOSLeavingTransition extends ViewTransition {

  constructor(navCtrl, viewCtrl, opts) {
    super(navCtrl, viewCtrl, opts);

    // leaving viewCtrl moves off screen
    this.content
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1)
      .before.setStyles({ zIndex: viewCtrl.index })
      .after.removeClass('show-view');

    this.title
      .from(TRANSLATEX, CENTER)
      .from(OPACITY, 1);

    this.navbarBg
      .from(TRANSLATEX, CENTER);

    this.navbarItems
      .fadeOut();

    this.backButton
      .after.removeClass('show-back-button')
      .fadeOut();

    this.navbar.after.removeClass('show-navbar');

    // set properties depending on direction
    if (opts.direction === 'back') {

      // back direction
      this.content
        .to(TRANSLATEX, '100%')
        .to(OPACITY, 1);

      this.title
        .to(TRANSLATEX, '100%')
        .to(OPACITY, 0);

      this.navbarBg
        .to(TRANSLATEX, '100%')
        .fadeOut();

      // if (this.leaving && this.leaving.enableBack() && this.viewWidth() > 200) {
      //   let leavingBackButtonText = new Animation(this.leaving.backBtnTextRef());
      //   leavingBackButtonText.fromTo(TRANSLATEX, CENTER, (this.viewWidth() / 2) + 'px');
      //   this.leavingNavbar.add(leavingBackButtonText);
      // }

    } else {
      // forward direction
      this.content
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, OFF_OPACITY);

      this.title
        .to(TRANSLATEX, OFF_LEFT)
        .to(OPACITY, 0);

      this.navbarBg
        .to(TRANSLATEX, OFF_LEFT);
    }

  }

}

Transition.register('ios', IOSTransition);
