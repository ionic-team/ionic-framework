import {Component, Template, Inject, Parent, NgElement} from 'angular2/angular2';
import {Ion} from '../ion';
import {IonConfig} from '../../config';
import {DragGesture} from '../../core/gestures/drag-gesture';
import * as util from '../../util';

export var sideMenuConfig = new IonConfig();

// TODO defaults or bindings?
sideMenuConfig.defaults({
  side: 'left',
  dragThreshold: '50'
});

@Component({
  selector: 'ion-side-menu',
  bind: {
    side: 'side',
    dragThreshold: 'dragThreshold'
  },
})
@Template({
  inline: `<content></content>`
})
export class SideMenu extends Ion {
  constructor(
    @Parent() sideMenuParent: SideMenuParent,
    @NgElement() element: NgElement
  ) {
    this.domElement = element.domElement;

    this._drag = {};

    this.gesture = new DragGesture(sideMenuParent.domElement, {
      onDrag: this.onDrag.bind(this),
      onDragStart: this.onDragStart.bind(this),
      onDragEnd: this.onDragEnd.bind(this)
    });
    this.dragMethods = {
      getMenuStart() { return 0; },
      getEventPos(ev) { return ev.center.x; }
    };
    this.gesture.listen();

    this.domElement.addEventListener('transitionend', ev => {
      this.setChanging(false);
    })

    sideMenuConfig(this);
  }
  onDragStart(ev) {
    if (!this.dragMethods.canStart(ev)) {
      return false;
    }

    this.setChanging(true);
    this.domElement.classList.add('dragging');
    requestAnimationFrame(() => {
      this._drag = {
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
        width: this.domElement.offsetWidth,
        height: this.domElement.offsetHeight,
        pointerStart: this.dragMethods.getEventPos(ev)
      };
      this._drag.menuStart = this.dragMethods.getMenuStart(this._drag, ev);
      this._drag.started = true;
    });
  }
  onDrag(ev) {
    if (!this._drag) return;
    this.dragMethods.onDrag(this._drag, ev);
  }
  onDragEnd(ev) {
    if (!this._drag) return;
    var { pos, width } = this._drag;

    this.domElement.classList.remove('dragging');
    this.dragMethods.onEnd(this._drag, ev);
    this._drag = null;
  }
  setChanging(isChanging) {
    if (isChanging !== this.isChanging) {
      this.isChanging = isChanging;
      this.domElement.classList[isChanging ? 'add' : 'remove']('changing');
    }
  }
  setOpen(isOpen) {
    if (isOpen !== this.isOpen) {
      this.isOpen = isOpen;
      this.setChanging(true);
      requestAnimationFrame(() => {
        this.domElement.classList[isOpen ? 'add' : 'remove']('open');
      })
    }
  }
}

@Component({
  selector: 'ion-side-menu-parent'
})
@Template({
  inline: '<content></content>'
})
export class SideMenuParent {
  constructor(@NgElement() element: NgElement) {
    this.domElement = element.domElement;
    super();
  }
}
