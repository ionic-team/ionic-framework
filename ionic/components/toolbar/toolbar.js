import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {ElementRef} from 'angular2/src/core/compiler/element_ref';
import {ProtoViewRef} from 'angular2/src/core/compiler/view_ref';
import {NgZone} from 'angular2/src/core/zone/ng_zone';

import {Platform} from 'ionic/platform/platform';
import * as dom from '../../util/dom';


@Component({
  selector: 'ion-toolbar'
})
@View({
  template: `<div class="toolbar-inner"><content></content></div>`,
  /*
  <div class="toolbar-title"><div class="toolbar-inner-title toolbar-title-hide"><content select="ion-title"></content></div></div><div class="toolbar-item toolbar-primary-item"><content select="[primary]"></content></div><div class="toolbar-item toolbar-secondary-item"><content select="[secondary]"></content></div></div>`,
  */
  directives: []
})
export class Toolbar {
  constructor(elementRef:ElementRef, ngZone:NgZone) {
    this.domElement = elementRef.domElement;
    Toolbar.config.invoke(this);

    /*
    TODO(mlynch): Revive this when the above content select don't throw errors.
    ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.alignTitle();
      }, 32);
    });
    */
  }

  alignTitle() {
    const toolbarEle = this.domElement;
    const innerTitleEle = this._innerTitleEle || (this._innerTitleEle = toolbarEle.querySelector('.toolbar-inner-title'));
    const titleEle = this._titleEle || (this._titleEle = innerTitleEle.querySelector('ion-title'));
    const style = this._style || (this._style = window.getComputedStyle(titleEle));

    const titleOffsetWidth = titleEle.offsetWidth;
    const titleOffsetLeft = titleEle.offsetLeft;
    const titleScrollWidth = titleEle.scrollWidth;
    const toolbarOffsetWidth = toolbarEle.offsetWidth;

    // TODO!!! When an element is being reused by angular2, it'll sometimes keep the
    // styles from the original element's use, causing these calculations to be wrong
    if (window.getComputedStyle(innerTitleEle).margin !== '0px') {
      this._showTitle();
      return;
    }

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


/*
  Used to find and register headers in a view, and this directive's
  content will be moved up to the common toolbar location, and created
  using the same context as the view's content area.
*/
@Directive({
  selector: 'template[toolbar]'
})
export class ToolbarTemplate {
  constructor(item: ViewItem, protoViewRef: ProtoViewRef) {
    item.addProtoViewRef('toolbar', protoViewRef);
  }
}
