import {Component, Template, Inject, Parent, NgElement} from 'angular2/angular2';
import {Ion} from '../ion';
// import {EdgeDragGesture} from '../../core/gestures/edge-drag-gesture';

@Component({
  selector: 'ion-side-menu',
  bind: {
    side: 'side'
  }
})
@Template({
  inline: `<content></content>`
})
export class SideMenu extends Ion {
  constructor(
    @Parent() sideMenuParent: SideMenuParent, 
    @NgElement() element: NgElement
  ) {
    this.el = element;
    // this.gesture = new EdgeDragGesture(sideMenuParent.el.domElement, this);
    this._drag = {};
    super();
  }
  onDragStart(ev) {
    this._drag = {
      width: this.el.domElement.offsetWidth
    };
    this.el.domElement.classList.add('no-animate');
  }
  onDrag(ev) {
    var pos = this._drag.pos =  Math.max(0, Math.min(ev.center.x, this._drag.width));
    this.el.domElement.style.transform = 'translate3d(0,' + pos + 'px,0)';
  }
  onDragEnd(ev) {
    var { pos, width } = this._drag;
    this.el.domElement.style.transform = '';
    if (pos < width / 2) {
      this.close();
    } else if (pos > width / 2) {
      this.open();
    }
    this.el.domElement.style.transform = '';
    this.el.domElement.classList.remove('no-animate');
    this._drag = null;
  }
  open() {
    this.el.domElement.classList.add('open');
  }
  close() {
    this.el.domElement.classList.remove('open');
  }
}

@Component({
  selector: 'ion-side-menu-parent'
})
@Template({
  inline: '<content></content>'
})
export class SideMenuParent extends Ion {
  constructor(@NgElement() element: NgElement) {
    this.el = element;
    super();
  }
}
