import { Animation, AnimationOptions } from '../animations/animation';
import { closest } from '../util/dom';
import { Content } from '../components/content/content';
import { Tabs } from '../components/tabs/tabs';
import { Transition } from './transition';
import { ViewController } from '../components/nav/view-controller';


/**
 * @private
 */
export class PageTransition extends Transition {
  enteringPage: Animation;

  init(enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions) {
    super.init(enteringView, leavingView, opts);

    this.enteringPage = new Animation(enteringView.pageElementRef());
    this.add(this.enteringPage.before.addClass('show-page'));

    this.before.addDomReadFn(this.readDimensions.bind(this));
    this.before.addDomWriteFn(this.writeDimensions.bind(this));
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

}

function parsePxUnit(val: string): number {
  return (val.indexOf('px') > 0) ? parseInt(val, 10) : 0;
}
