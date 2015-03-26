import {Aside} from '../../aside';

// TODO figure out if we can make all of these bindings (eg can we make it so content's transform is bound to
// aside component's `transform` property?)
class AsideBaseType {
  constructor(aside: Aside) {
    this.aside = aside;

    // TODO make this a setter
    aside.domElement.classList.add(`type-${aside.type}`);

    //FIXME(ajoslin): have to wait for for bindings to apply in a component
    setTimeout(() => {
      this.aside.content.domElement.classList.add('aside-content')
    })
  }
  setSliding(isSliding) {
    this.aside.domElement.classList[isSliding ? 'add' : 'remove']('no-transition');
  }
  setOpen(isOpen) {
    this.aside.domElement.classList[isOpen ? 'add' : 'remove']('open');
  }
  setTransform(transform) {
    this.aside.domElement.style.transform = transform;
  }
}

export class AsideOverlayType extends AsideBaseType {}

export class AsidePushType extends AsideBaseType {
  setSliding(isSliding) {
    super.setSliding(isSliding);
    this.aside.content.domElement.classList[isSliding ? 'add' : 'remove']('no-transition');
  }
  setOpen(isOpen) {
    super.setOpen(isOpen);
    this.aside.content.domElement.classList[isOpen ? 'add' : 'remove'](
      `aside-open-${this.aside.side}`
    );
  }
  setTransform(transform) {
    super.setTransform(transform);
    this.aside.content.domElement.style.transform = transform;
  }
}

export class AsideRevealType extends AsideBaseType {
  setSliding(isSliding) {
    this.aside.content.domElement.classList[isSliding ? 'add' : 'remove']('no-transition');
  }
  setOpen(isOpen) {
    this.aside.content.domElement.classList[isOpen ? 'add' : 'remove'](
      `aside-open-${this.aside.side}`
    );
  }
  setTransform(transform) {
    this.aside.content.domElement.style.transform = transform;
  }
}
