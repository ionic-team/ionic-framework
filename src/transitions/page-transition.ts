import {Animation} from '../animations/animation';
import {closest} from '../util/dom';
import {Content} from '../components/content/content';
import {Tabs} from '../components/tabs/tabs';
import {Transition, TransitionOptions} from './transition';
import {ViewController} from '../components/nav/view-controller';


/**
 * @private
 */
export class PageTransition extends Transition {
  enteringPage: Animation;

  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    this.enteringPage = new Animation(this.enteringView.pageRef());
    this.enteringPage.before.addClass('show-page');
    this.add(this.enteringPage);

    this.before.addDomReadFn(this.readDimensions.bind(this));
    this.before.addDomWriteFn(this.writeDimensions.bind(this));
  }

  /**
   * DOM READ
   */
  readDimensions() {
    let content = <Content>this.enteringView.getContent();
    if (content && content instanceof Content) {
      content.readDimensions();
    }
  }

  /**
   * DOM WRITE
   */
  writeDimensions() {
    let content = <Content>this.enteringView.getContent();
    if (content && content instanceof Content) {
      content.writeDimensions();
    }
  }

  destroy() {
    super.destroy();
    this.enteringView = this.enteringPage = null;
  }

}

function parsePxUnit(val: string): number {
  return (val.indexOf('px') > 0) ? parseInt(val, 10) : 0;
}
