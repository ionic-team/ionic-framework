import {Directive, View, Host, ElementRef, forwardRef} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonicConfig} from '../../config/config';
import {IonicComponent} from '../../config/annotations';

/**
 * TODO
 */
export class ToolbarBase extends Ion  {

  constructor(elementRef: ElementRef, config: IonicConfig) {
    super(elementRef, config);
    this.titleAlign = config.setting('navTitleAlign');
    this.itemEles = [];
  }

  /**
   * TODO
   * @param {TODO} eleRef  TODO
   * @returns {TODO} TODO
   */
  titleElement(eleRef) {
    if (arguments.length) {
      this._nbTlEle = eleRef;
    }
    return this._nbTlEle;
  }

  /**
   * TODO
   * @param {TODO} eleRef  TODO
   * @returns {TODO} TODO
   */
  itemElements(eleRef) {
    if (arguments.length) {
      this.itemEles.push(eleRef);
    }
    return this.itemEles;
  }

  /**
   * TODO
   * @param {TODO} eleRef  TODO
   * @returns {TODO} TODO
   */
  titleText(eleRef) {
    if (arguments.length) {
      this._ttTxt.push(eleRef);
    }
    return this._ttTxt;
  }

  afterViewChecked() {
    // if (this._queueAlign) {
    //   this._queueAlign = false;
    //   this._alignTitle();
    // }
  }

  /**
   * TODO
   */
  alignTitle() {
    //this._queueAlign = (this.titleAlign === 'center');
  }

  _alignTitle() {
    // don't bother if we're not trying to center align the title
    if (this.aligned) return;

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

/**
 * TODO
 */
@IonicComponent({
  selector: 'ion-toolbar'
})
@View({
  template: `
    <div class="toolbar-inner">
      <ng-content select="[menu-toggle]"></ng-content>
      <div class="toolbar-title">
        <div class="toolbar-inner-title">
          <ng-content select="ion-title"></ng-content>
        </div>
      </div>
      <div class="toolbar-item toolbar-primary-item">
        <ng-content select="[primary]"></ng-content>
      </div>
      <div class="toolbar-item toolbar-secondary-item">
        <ng-content select="[secondary]"></ng-content>
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

  onInit() {
    super.onInit();

    // TODO: THIS IS HORRIBLE, FIX
    // setTimeout(() => {
    //   this.alignTitle();

    //   setTimeout(() => {
    //     this.alignTitle()
    //   }, 64);

    // }, 32);
  }

}


@Directive({
  selector: '.toolbar-title'
})
class ToolbarTitle {
  constructor(@Host() toolbar: Toolbar, elementRef: ElementRef) {
    toolbar.titleElement(elementRef);
  }
}


@Directive({
  selector: '.toolbar-item'
})
class ToolbarItem {
  constructor(@Host() toolbar: Toolbar, elementRef: ElementRef) {
    toolbar.itemElements(elementRef);
  }
}
