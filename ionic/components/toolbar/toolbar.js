import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ViewContainerRef} from 'angular2/angular2';

import * as dom from 'ionic/util/dom'
import {IonicComponent} from 'ionic/config/component';
import {NavItem} from 'ionic/ionic';
import {Platform} from 'ionic/platform/platform';


@Directive({
  selector: '[ion-toolbar]',
  properties: {
    placement: 'placement'
  }
})
export class Toolbar {

  constructor(
    viewContainer: ViewContainerRef,
    elementRef: ElementRef,
    navItem: NavItem
  ) {
    this.viewContainer = viewContainer;
    this.elementRef = elementRef;
    this.navItem = navItem;

    console.log('Toolbar!');

    // TODO use config to add these classes
    this.elementRef.domElement.classList.add('toolbar');
    this.elementRef.domElement.classList.add(`toolbar-${Platform.getMode()}`);

    // TODO Make a better way than this
    if (/footer/i.test(this.elementRef.domElement.tagName)) {
      this.placement = 'bottom';
    } else {
      this.placement = 'top';
    }
  }

  set placement(pos) {
    this.elementRef.domElement.classList.add(`toolbar-${pos}`);
    this.elementRef.domElement.setAttribute('placement', pos);

    this._placement = pos;
    this.navItem.addToolbar(this._placement, this);
  }

}


@Component({
  selector: '.toolbar-title',
  // events: {
  //   'window:resize': 'align()',
  // }
})
@View({
  template: `
  <div class="toolbar-inner-title toolbar-title-hide">
    <content></content>
  </div>`
})
export class ToolbarTitle {
  constructor(
    element: NgElement
  ) {
    // this.domElement = element.domElement;

    // // TODO find better way to get parent toolbar
    // let current = this.domElement;
    // while (current = current.parentNode) {
    //   if (current.classList.contains('toolbar')) {
    //     break;
    //   }
    // }
    // this.toolbarElement = current;
    // this.align();
  }

  align() {
    if (!this.toolbarElement) return;
    const toolbarElement = this.toolbarElement;
    const titleElement = this._titleElement || (this._titleElement = this.domElement.querySelector('.toolbar-inner-title'));
    const style = this._style || (this._style = window.getComputedStyle(titleElement));

    const titleOffsetWidth = titleElement.offsetWidth;
    const titleOffsetLeft = titleElement.offsetLeft;
    const titleScrollWidth = titleElement.scrollWidth;
    const toolbarOffsetWidth = toolbarElement.offsetWidth;

    //only align if the title is center and if it isn't already overflowing
    if (style.textAlign !== 'center' || titleOffsetWidth < titleScrollWidth) {
      this._showTitle();
    } else {
      let rightMargin = toolbarOffsetWidth - (titleOffsetLeft + titleOffsetWidth);
      let centerMargin = titleOffsetLeft - rightMargin;

      titleElement.style.margin = `0 ${centerMargin}px 0 0`;

      dom.raf(() => {
        if (titleElement.offsetWidth < titleElement.scrollWidth) {
          this.titleElement.style.margin = ''
          this.titleElement.style.textAlign = 'left'
        }
        this._showTitle();
      })
    }
  }

  _showTitle() {
    if (this._shown) return;
    this._shown = true;
    this._titleElement.classList.remove('toolbar-title-hide');
  }
}

@Decorator({
  selector: '[toolbar-create]',
  properties: {
    'toolbar': 'toolbar-create'
  },
})
export class ToolbarContainer {
  constructor(
    viewContainer: ViewContainerRef,
    element: NgElement
  ) {
    this.viewContainer = viewContainer;
    this.domElement = element.domElement;
  }

  set toolbar(bar: Toolbar) {
    if (bar) {
      // TODO create with correct context
      this.viewContainer.create(-1, bar.viewContainer._defaultProtoView, bar.elementRef.elementInjector);
      console.log('creating viewportContainer', performance.now())
    }
  }
}
