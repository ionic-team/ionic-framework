import { Animation } from '../../animations/animation';
import { Transition } from './transition';

/**
 * @hidden
 */
export class PageTransition extends Transition {
  enteringPage: Animation;

  init() {
    if (this.enteringView) {
      this.enteringPage = new Animation(this.enteringView.element);
      this.add(this.enteringPage.beforeAddClass('show-page'));

      // Resize content before transition starts
      this.beforeAddRead(() => {
        // TODO this.enteringView.readReady.emit();
      });
      this.beforeAddWrite(() => {
        // TODO this.enteringView.writeReady.emit();
      });
    }
  }

  destroy() {
    super.destroy();
    this.enteringPage && this.enteringPage.destroy();
    this.enteringPage = null;
  }

}
