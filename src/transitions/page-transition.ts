import {Animation} from '../animations/animation';
import {closest} from '../util/dom';
import {Content} from '../components/content/content';
import {Tabs} from '../components/tabs/tabs';
import {Transition} from './transition';
import {ViewController} from '../components/nav/view-controller';


/**
 * @private
 */
export class PageTransition extends Transition {
  enteringPage: Animation;
  paddingTop = 0;
  paddingBottom = 0;
  headerHeight = 0;
  footerHeight = 0;
  tabbarOnTop: boolean = null;

  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    this.enteringPage = new Animation(this.enteringView.pageRef());
    this.enteringPage.before.addClass('show-page');
    this.add(this.enteringPage);

    this.before.addDomReadFn(this.readDimensions.bind(this));
    this.before.addDomWriteFn(this.writeContentPadding.bind(this));
  }

  /**
   * DOM READ
   */
  readDimensions() {
    let pageElementRef = this.enteringView.pageRef();
    if (!pageElementRef) return;

    let pageEle = <HTMLElement>pageElementRef.nativeElement;
    if (pageEle.tagName !== 'ION-PAGE') {
      pageEle = <HTMLElement>pageEle.querySelector('ion-page');
      if (!pageEle) {
        return;
      }
    }

    let ele: HTMLElement;
    let computedStyle: any;

    for (var i = 0; i < pageEle.children.length; i++) {
      ele = <HTMLElement>pageEle.children[i];

      if (ele.tagName === 'ION-CONTENT') {
        computedStyle = getComputedStyle(ele);
        this.paddingTop += parsePxUnit(computedStyle.paddingTop);
        this.paddingBottom += parsePxUnit(computedStyle.paddingBottom);

      } else if (ele.tagName === 'ION-HEADER') {
        this.headerHeight = ele.clientHeight;
        this.paddingTop += this.headerHeight;

      } else if (ele.tagName === 'ION-FOOTER') {
        this.footerHeight = ele.clientHeight;
        this.paddingBottom += this.footerHeight;
      }
    }

    ele = pageEle;
    let tabbarEle: HTMLElement;
    let tabbarOnTop: boolean;

    while (ele && ele.tagName !== 'ION-MODAL' && !ele.classList.contains('tab-subpage')) {

      if (ele.tagName === 'ION-TABS') {
        tabbarEle = <HTMLElement>ele.firstElementChild;
        tabbarOnTop = ele.getAttribute('tabbarplacement') === 'top';

        if (tabbarOnTop) {
          this.paddingTop += tabbarEle.clientHeight;

        } else {
          this.paddingBottom += tabbarEle.clientHeight;
        }

        if (this.tabbarOnTop === null) {
          // this is the first tabbar found, remember it's position
          this.tabbarOnTop = tabbarOnTop;
        }
      }

      ele = ele.parentElement;
    }
  }

  /**
   * DOM WRITE
   */
  writeContentPadding() {
    if (this.paddingTop || this.paddingBottom) {
      let content = <Content>this.enteringView.getContent();

      if (content && content instanceof Content) {
        content.setContentPadding(this.paddingTop, this.paddingBottom);
      }
    }

    if (this.tabbarOnTop !== null) {
      let tab = this.enteringView.getNav();
      if (tab && tab.parent) {
        let tabs = <Tabs>tab.parent;
        if (tabs instanceof Tabs) {
          if (this.tabbarOnTop) {
            tabs.setTabbarPosition(this.headerHeight, -1);

          } else {
            tabs.setTabbarPosition(-1, 0);
          }
        }
      }
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

export interface TransitionOptions {
  animation: string;
  duration: number;
  easing: string;
  direction: string;
  renderDelay?: number;
  isRTL?: boolean;
  ev?: any;
}

