import {Menu} from './menu';
import {Animation} from 'ionic/animations/animation';


/**
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export class MenuType {

  constructor() {
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

  setProgressEnd(shouldComplete) {
    let resolve;
    let promise = new Promise(res => { resolve = res });

    let isOpen = (this.isOpening && shouldComplete);
    if (!this.isOpening && !shouldComplete) {
      isOpen = true;
    }

    this.seek.progressEnd(shouldComplete).then(() => {
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
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
class MenuRevealType extends MenuType {
  constructor(menu) {
    super();

    let easing = 'ease';
    let duration = 250;

    let openedX = (menu.width() * (menu.side == 'right' ? -1 : 1)) + 'px';
    let closedX = '0px'

    this.open.easing(easing).duration(duration);
    this.close.easing(easing).duration(duration);

    let contentOpen = new Animation(menu.getContentElement());
    contentOpen.fromTo(TRANSLATE_X, closedX, openedX);
    this.open.add(contentOpen);

    let contentClose = new Animation(menu.getContentElement());
    contentClose.fromTo(TRANSLATE_X, openedX, closedX);
    this.close.add(contentClose);
  }
}
Menu.register('reveal', MenuRevealType);


/**
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
class MenuOverlayType extends MenuType {
  constructor(menu) {
    super();

    let easing = 'ease';
    let duration = 250;
    let backdropOpacity = 0.35;

    let closedX, openedX;
    if (menu.side == 'right') {
      // right side
      closedX = menu.platform.width() + 'px';
      openedX = (menu.platform.width() - menu.width() - 8) + 'px';

    } else {
      // left side
      closedX = -menu.width() + 'px';
      openedX = '8px';
    }

    this.open.easing(easing).duration(duration);
    this.close.easing(easing).duration(duration);

    let menuOpen = new Animation(menu.getMenuElement());
    menuOpen.fromTo(TRANSLATE_X, closedX, openedX);
    this.open.add(menuOpen);

    let backdropOpen = new Animation(menu.getBackdropElement());
    backdropOpen.fromTo(OPACITY, 0.01, backdropOpacity);
    this.open.add(backdropOpen);

    let menuClose = new Animation(menu.getMenuElement());
    menuClose.fromTo(TRANSLATE_X, openedX, closedX);
    this.close.add(menuClose);

    let backdropClose = new Animation(menu.getBackdropElement());
    backdropClose.fromTo(OPACITY, backdropOpacity, 0.01);
    this.close.add(backdropClose);
  }
}
Menu.register('overlay', MenuOverlayType);


const OPACITY = 'opacity';
const TRANSLATE_X = 'translateX';
