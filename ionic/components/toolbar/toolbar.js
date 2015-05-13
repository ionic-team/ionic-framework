import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';

import * as dom from 'ionic/util/dom';
import {IonicComponent} from 'ionic/config/component';
import {NavItem} from 'ionic/ionic';
import {Platform} from 'ionic/platform/platform';


@Directive({
  selector: '[ion-header]'
})
export class Header {

  constructor(navItem: NavItem, protoViewRef: ProtoViewRef) {
    navItem.addHeader(protoViewRef);
  }

}


@Component({
  selector: '.toolbar-title'
})
@View({
  template: `
  <div class="toolbar-inner-title toolbar-title-hide">
    <content></content>
  </div>`
})
export class ToolbarTitle {
  constructor(
    element: ElementRef
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
          this.titleElement.style.margin = '';
          this.titleElement.style.textAlign = 'left';
        }
        this._showTitle();
      })
    }
  }

  _showTitle() {
    if (!this._shown) {
      this._shown = true;
      this._titleElement.classList.remove('toolbar-title-hide');
    }
  }

}
