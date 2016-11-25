import { Animation } from '../animations/animation';
import { Transition } from './transition';


/**
 * @private
 */
export class PageTransition extends Transition {
  enteringPage: Animation;

  init() {
    if (this.enteringView) {
      this.enteringPage = new Animation(this.enteringView.pageRef());
      this.add(this.enteringPage.beforeAddClass('show-page'));

      // Resize content before transition starts
      this.beforeAddRead(this.readDimensions.bind(this));
      this.beforeAddWrite(this.writeDimensions.bind(this));
    }
  }

  /**
   * DOM READ
   */
  readDimensions() {
    const content = this.enteringView.getIONContent();
    if (content) {
      content.readDimensions();
    }
  }

  /**
   * DOM WRITE
   */
  writeDimensions() {
    const content = this.enteringView.getIONContent();
    if (content) {
      content.writeDimensions();
    }
  }

  destroy() {
    super.destroy();
    this.enteringPage = null;
  }

}
