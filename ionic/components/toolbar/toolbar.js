import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';

import * as dom from 'ionic/util/dom';
import {IonicComponent} from 'ionic/config/component';
import {NavItem} from 'ionic/ionic';
import {Platform} from 'ionic/platform/platform';
import {BackButton} from './back-button';


@Component({
  selector: 'ion-toolbar'
})
@View({
  template: `
    <div class="toolbar-inner">
      <back-button class="button toolbar-item" [hidden]="!navItem.enableBack"></back-button>
      <div class="toolbar-title">
        <div class="toolbar-inner-title toolbar-title-hide">
          <content select="ion-title"></content>
        </div>
      </div>
      <!--<div class="toolbar-item toolbar-primary-item">
        <content select=".primary"></content>
      </div>
      <div class="toolbar-item toolbar-secondary-item">
        <content select=".secondary"></content>
      </div>-->
    </div>
  `,
  directives: [BackButton]
})
export class Toolbar {
  constructor(navItem: NavItem, elementRef: ElementRef) {

    this.navItem = navItem;
    this.domElement = elementRef.domElement;
    this.config = Toolbar.config.invoke(this);

    // http://davidwalsh.name/detect-node-insertion
    dom.animationStart(this.domElement, 'nodeInserted').then(() => {
      this.alignTitle();
    });

  }

  alignTitle() {
    if (!this.domElement) return;

    const toolbarEle = this.domElement;
    const innerTitleEle = this._innerTitleEle || (this._innerTitleEle = toolbarEle.querySelector('.toolbar-inner-title'));
    const titleEle = this._titleEle || (this._titleEle = innerTitleEle.querySelector('ion-title'));
    const style = this._style || (this._style = window.getComputedStyle(titleEle));

    const titleOffsetWidth = titleEle.offsetWidth;
    const titleOffsetLeft = titleEle.offsetLeft;
    const titleScrollWidth = titleEle.scrollWidth;
    const toolbarOffsetWidth = toolbarEle.offsetWidth;

    // only align if the title is center and if it isn't already overflowing
    if (style.textAlign !== 'center' || titleOffsetWidth < titleScrollWidth) {
      this._showTitle();

    } else {
      let rightMargin = toolbarOffsetWidth - (titleOffsetLeft + titleOffsetWidth);
      let centerMargin = titleOffsetLeft - rightMargin;

      innerTitleEle.style.margin = `0 ${centerMargin}px 0 0`;

      dom.raf(() => {
        if (titleEle.offsetWidth < titleEle.scrollWidth) {
          // not enough room yet, just left align title
          innerTitleEle.style.margin = '';
          innerTitleEle.style.textAlign = 'left';
        }
        this._showTitle();
      })
    }
  }

  _showTitle() {
    if (!this._shown) {
      this._shown = true;
      this._innerTitleEle.classList.remove('toolbar-title-hide');
    }
  }


}
new IonicComponent(Toolbar, {});


/*
  Used to find and register headers in a view, and this directive's
  content will be moved up to the common toolbar location, and created
  using the same context as the view's content area.
*/
@Directive({
  selector: 'template[header]'
})
export class HeaderTemplate {
  constructor(navItem: NavItem, protoViewRef: ProtoViewRef) {
    navItem.addHeader(protoViewRef);
  }
}
