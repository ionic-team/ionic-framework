import {Aside} from '../aside';
import {Animation} from 'ionic/animations/animation';


/**
 * Aside Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Aside.
 */
export class AsideType {

  constructor(aside: Aside) {
    this.open = new Animation();
    this.close = new Animation();
  }

  setOpen(shouldOpen) {
    return new Promise(resolve => {
      if (shouldOpen) {
        this.open.playbackRate(1).onFinish(resolve, true).play();
      } else {
        this.close.playbackRate(1).onFinish(resolve, true).play();
      }
    });
  }

  setProgressStart(isOpen) {
    this.isOpening = !isOpen;

    this.seek && this.seek.dispose();

    // clone the correct animation depending on open/close
    if (this.isOpening) {
      this.seek = this.open.clone();
    } else {
      this.seek = this.close.clone();
    }

    // the cloned animation should not use an easing curve during seek
    this.seek.easing('linear').progressStart();
  }

  setProgess(value) {
    // adjust progress value depending if it opening or closing
    if (!this.isOpening) {
      value = 1 - value;
    }
    this.seek.progress(value);
  }

  setProgressFinish(shouldComplete) {
    let resolve;
    let promise = new Promise(res => { resolve = res });

    let isOpen = (this.isOpening && shouldComplete);
    if (!this.isOpening && !shouldComplete) {
      isOpen = true;
    }

    this.seek.progressFinish(shouldComplete).then(() => {
      this.isOpening = false;
      resolve(isOpen);
    });

    return promise;
  }

  onDestory() {
    this.open && this.open.dispose();
    this.close && this.close.dispose();
    this.seek && this.seek.dispose();
  }

}


/**
 * Aside Reveal Type
 * The content slides over to reveal the aside underneath.
 * The aside menu itself, which is under the content, does not move.
 */
class AsideRevealType extends AsideType {
  constructor(aside) {
    super();

    let easing = 'ease';
    let duration = 250;

    let openedX = (aside.width() * (aside.side == 'right' ? -1 : 1)) + 'px';

    this.open.easing(easing).duration(duration);
    this.close.easing(easing).duration(duration);

    let contentOpen = new Animation(aside.getContentElement());
    contentOpen.fromTo(TRANSLATE_X, CENTER, openedX);
    this.open.add(contentOpen);

    let contentClose = new Animation(aside.getContentElement());
    contentClose.fromTo(TRANSLATE_X, openedX, CENTER);
    this.close.add(contentClose);
  }
}
Aside.register('reveal', AsideRevealType);


/**
 * Aside Overlay Type
 * The aside menu slides over the content. The content
 * itself, which is under the aside, does not move.
 */
class AsideOverlayType extends AsideType {
  constructor(aside) {
    super();

    let easing = 'ease';
    let duration = 250;
    let backdropOpacity = 0.5;

    let closedX = (aside.width() * (aside.side == 'right' ? 1 : -1)) + 'px';

    this.open.easing(easing).duration(duration);
    this.close.easing(easing).duration(duration);

    let asideOpen = new Animation(aside.getAsideElement());
    asideOpen.fromTo(TRANSLATE_X, closedX, CENTER);
    this.open.add(asideOpen);

    let backdropOpen = new Animation(aside.getBackdropElement());
    backdropOpen.fromTo(OPACITY, 0.01, backdropOpacity);
    this.open.add(backdropOpen);

    let asideClose = new Animation(aside.getAsideElement());
    asideClose.fromTo(TRANSLATE_X, CENTER, closedX);
    this.close.add(asideClose);

    let backdropClose = new Animation(aside.getBackdropElement());
    backdropClose.fromTo(OPACITY, backdropOpacity, 0.01);
    this.close.add(backdropClose);
  }
}
Aside.register('overlay', AsideOverlayType);


const OPACITY = 'opacity';
const TRANSLATE_X = 'translateX';
const CENTER = '0px';
