import {Aside} from '../../aside';

// TODO use setters instead of direct dom manipulation
let asideManipulator = {
  setSliding(is) {
    this.aside.domElement.classList[is ? 'add' : 'remove']('no-transition');
  },
  setOpen(is) {
    this.aside.domElement.classList[is ? 'add' : 'remove']('open');
  },
  setTransform(t) {
    this.aside.domElement.style.transform = t;
  }
}
let contentManipulator = {
  setSliding(is) {
    this.aside.content.domElement.classList[is ? 'add' : 'remove']('no-transition');
  },
  setOpen(is) {
    this.aside.content.domElement.classList[is ? 'add' : 'remove'](
      `aside-open-${this.aside.side}`
    )
  },
  setTransform(t) {
    this.aside.content.domElement.style.transform = t;
  }
}

class AsideType {
  constructor(aside) {
    this.aside = aside;

    aside.domElement.classList.add(`type-${aside.type}`);

    //FIXME(ajoslin): have to wait for for bindings to apply in a component
    setTimeout(() => {
      this.aside.content.domElement.classList.add('aside-content')
    })
  }
}

export class AsideTypeOverlay extends AsideType {
  setSliding(is) {
    asideManipulator.setSliding.call(this, is);
  }
  setOpen(is) {
    asideManipulator.setOpen.call(this, is);
  }
  setTransform(t) {
    asideManipulator.setTransform.call(this, t);
  }
}

export class AsideTypePush extends AsideType {
  setSliding(is) {
    asideManipulator.setSliding.call(this, is);
    contentManipulator.setSliding.call(this, is);
  }
  setOpen(is) {
    asideManipulator.setOpen.call(this, is);
    contentManipulator.setOpen.call(this, is);
  }
  setTransform(t) {
    asideManipulator.setTransform.call(this, t);
    contentManipulator.setTransform.call(this, t);
  }
}

export class AsideTypeReveal extends AsideType {
  setSliding(is) {
    contentManipulator.setSliding.call(this, is);
  }
  setOpen(is) {
    asideManipulator.setOpen.call(this, is);
    contentManipulator.setOpen.call(this, is);
  }
  setTransform(t) {
    contentManipulator.setTransform.call(this, t);
  }
}
