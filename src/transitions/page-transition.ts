import { Animation } from '../animations/animation';
import { Content } from '../components/content/content';
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

      this.beforeAddRead(this.readDimensions.bind(this));
      this.beforeAddWrite(this.writeDimensions.bind(this));
    }
  }

  /**
   * DOM READ
   */
  readDimensions() {
    const content = <Content>this.enteringView.getContent();
    if (content && content instanceof Content) {
      content.readDimensions();
    }
  }

  /**
   * DOM WRITE
   */
  writeDimensions() {
    const content = <Content>this.enteringView.getContent();
    if (content && content instanceof Content) {
      content.writeDimensions();
    }
  }

  destroy() {
    super.destroy();
    this.enteringPage = null;
  }

}
