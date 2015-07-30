import {Directive, View, Parent, onInit, ElementRef, forwardRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';


export class ToolbarBase extends Ion  {

  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
    this.titleAlign = config.setting('navTitleAlign');
    this.itemEles = [];
  }

  titleElement(eleRef) {
    if (arguments.length) {
      this._nbTlEle = eleRef;
    }
    return this._nbTlEle;
  }

  itemElements(eleRef) {
    if (arguments.length) {
      this.itemEles.push(eleRef);
    }
    return this.itemEles;
  }

  titleText(eleRef) {
    if (arguments.length) {
      this._ttTxt.push(eleRef);
    }
    return this._ttTxt;
  }

  alignTitle() {
    // don't bother if we're not trying to center align the title
    if (this.titleAlign !== 'center' || this.aligned) return;

    // called after the navbar/title has had a moment to
    // finish rendering in their correct locations
    const toolbarEle = this.getNativeElement();
    const titleEle = toolbarEle.querySelector('ion-title');

    // don't bother if there's no title element
    if (!titleEle) return;

    // get all the dimensions
    const titleOffsetLeft = titleEle.offsetLeft;
    const titleOffsetRight = toolbarEle.offsetWidth - (titleOffsetLeft + titleEle.offsetWidth);

    let marginLeft = 0;
    let marginRight = 0;
    if (titleOffsetLeft < titleOffsetRight) {
      marginLeft = (titleOffsetRight - titleOffsetLeft) + 5;

    } else if (titleOffsetLeft > titleOffsetRight) {
      marginRight = (titleOffsetLeft - titleOffsetRight) - 5;
    }

    if (marginLeft || marginRight) {
      // only do an update if it has to
      const innerTitleEle = toolbarEle.querySelector('.toolbar-inner-title');
      innerTitleEle.style.margin = `0 ${marginRight}px 0 ${marginLeft}px`;
    }

    this.aligned = true;
  }

}


@IonicComponent({
  selector: 'ion-toolbar'
})
@View({
  template: `
    <div class="toolbar-inner">
      <div class="toolbar-title">
        <div class="toolbar-inner-title">
          <content select="ion-title"></content>
        </div>
      </div>
      <div class="toolbar-item toolbar-primary-item">
        <content select="[primary]"></content>
      </div>
      <div class="toolbar-item toolbar-secondary-item">
        <content select="[secondary]"></content>
      </div>
    </div>
  `,
  directives: [
    forwardRef(() => ToolbarTitle),
    forwardRef(() => ToolbarItem)
  ]
})
export class Toolbar extends ToolbarBase {
  constructor(elementRef: ElementRef, ionicConfig: IonicConfig) {
    super(elementRef, ionicConfig);
    this.itemEles = [];
  }

  onIonInit() {
    // TODO: THIS IS HORRIBLE, FIX
    setTimeout(() => {
      this.alignTitle();

      setTimeout(() => {
        this.alignTitle()
      }, 64);

    }, 32);
  }

}


@Directive({
  selector: '.toolbar-title'
})
class ToolbarTitle {
  constructor(@Parent() toolbar: Toolbar, elementRef: ElementRef) {
    toolbar.titleElement(elementRef);
  }
}


@Directive({
  selector: '.toolbar-item'
})
class ToolbarItem {
  constructor(@Parent() toolbar: Toolbar, elementRef: ElementRef) {
    toolbar.itemElements(elementRef);
  }
}
