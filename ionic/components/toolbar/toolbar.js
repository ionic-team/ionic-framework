import {
  NgElement,
  Component,
  Decorator,
  Viewport,
  View as NgView,
  ViewContainer,
  //ProtoViewRef,
  onDestroy,
  Ancestor,
  ElementRef,
  onChange,
} from 'angular2/angular2';
import {BackButton} from 'ionic/components/toolbar/back-button';
import {IonicComponent} from 'ionic/config/component';
import {NavController} from 'ionic/components/nav/nav-item';
import {raf} from 'ionic/util/dom';
import {platform} from 'ionic/platform/platform';


// FYI for later:
// https://github.com/angular/angular/commit/3aac2fefd7f93c74abfa5ee58aa0ea8d4840b519



@Viewport({
  selector: '[ion-toolbar]',
  properties: {
    placement: 'placement'
  }
})
export class Toolbar {

  constructor(
    viewContainer: ViewContainer,
    //protoViewRef: ProtoViewRef,
    elementRef: ElementRef,
    @Ancestor() navCtrl: NavController,
    element: NgElement
    // context: Object TODO wait for angular to implement this
  ) {
    this.viewContainer = viewContainer;
    this.elementRef = elementRef;
    this.navCtrl = navCtrl;

    console.log('Toolbar!');

    // TODO use config to add these classes
    this.viewContainer.domElement.classList.add('toolbar');
    this.viewContainer.domElement.classList.add(`toolbar-${platform.getMode()}`);

    // TODO Make a better way than this
    if (/header/i.test(this.viewContainer.domElement.tagName)) {
      this.placement = 'top';
    } else {
      this.placement = 'bottom';
    }
  }

  set placement(pos) {
    this.viewContainer.domElement.classList.add(`toolbar-${pos}`);
    this._placement = pos;
    this.navCtrl.addToolbar(this._placement, this);
    this.viewContainer.domElement.setAttribute('placement', pos);
  }

  onDestroy() {
    this.navCtrl.removeToolbar(this);
  }
}


@Component({
  selector: '.toolbar-title',
  // events: {
  //   'window:resize': 'align()',
  // }
})
@NgView({
  template: `
  <div class="toolbar-inner-title toolbar-title-hide">
    <content></content>
  </div>`
})
export class ToolbarTitle {
  constructor(
    element: NgElement
  ) {
    this.domElement = element.domElement;

    // TODO find better way to get parent toolbar
    let current = this.domElement;
    while (current = current.parentNode) {
      if (current.classList.contains('toolbar')) {
        break;
      }
    }
    this.toolbarElement = current;
    this.align();
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

      raf(() => {
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
    viewContainer: ViewContainer,
    element: NgElement
  ) {
    this.viewContainer = viewContainer;
    this.domElement = element.domElement;
  }

  set toolbar(bar: Toolbar) {
    if (bar) {
      // TODO create with correct context
      this.viewContainer.create(-1, bar.viewContainer.defaultProtoView, bar.elementRef.elementInjector);
      console.log('creating viewportContainer', performance.now())
    }
  }
}

// @Component({
//   selector: 'ion-toolbar',
//   properties: {
//     title: 'nav-title'
//   }
// })
// @NgView({
//   template: `
//     <div class="toolbar-items">
//       <button class="button back-button toolbar-item" style="display:none"></button>

//       <div class="toolbar-title">
//         <div class="toolbar-inner-title">
//           {{ title }}
//           <content select=".toolbar-title"></content>
//         </div>
//       </div>

//       <div class="toolbar-item toolbar-primary-item">
//         <content select=".primary"></content>
//       </div>
//       <div class="toolbar-item toolbar-secondary-item">
//         <content select=".secondary"></content>
//       </div>
//     </div>
//   `,
//   directives: [BackButton]
// })
// export class Toolbar {
//   constructor(
//     @NgElement() ngEle:NgElement
//   ) {
//     this.domElement = ngEle.domElement;
//     this.config = Toolbar.config.invoke(this);

//     // TODO: make more better plz
//     setTimeout(() => {
//       this.alignTitle()
//     }, 32);
//   }


//   back() {
//     if (this.viewport && this.viewport._stack.length) {
//       this.viewport.pop()
//     }
//   }

// }
// new IonicComponent(Toolbar, {})
