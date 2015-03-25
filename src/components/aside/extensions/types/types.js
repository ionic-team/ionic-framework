import {Aside} from '../../aside';

// TODO figure out if we can make all of these bindings (eg content's transform is bound to
// aside component's `transform` propety
class AsideBaseType {
  constructor(aside: Aside) {
    this.aside = aside;

    // TODO make this a setter
    aside.domElement.classList.add(`type-${aside.type}`);

    //FIXME(ajoslin): have to wait for for bindings to apply in a component
    setTimeout(() => {
      this.aside.content.setIsAside(true);
    })
  }
  setSliding(isSliding) {
    this.aside.noTransitionSetter(isSliding);
  }
  setOpen(isOpen) {
    this.aside.openSetter(isOpen);
  }
  setTransform(transform) {
    this.aside.transformSetter(transform);
  }
}

export class AsideOverlayType extends AsideBaseType {}

export class AsidePushType extends AsideBaseType {
  setSliding(isSliding) {
    super.setSliding(isSliding);
    this.aside.content.noTransitionSetter(isSliding);
  }
  setOpen(isOpen) {
    super.setOpen(isOpen);
    this.aside.content.asideOpenSetter(isOpen, this.aside.side);
  }
  setTransform(transform) {
    super.setTransform(transform);
    this.aside.content.transformSetter(transform);
  }
}

export class AsideRevealType extends AsideBaseType {
  setSliding(isSliding) {
    this.aside.content.noTransitionSetter(isSliding);
  }
  setOpen(isOpen) {
    super.setOpen(isOpen);
    this.aside.content.asideOpenSetter(isOpen, this.aside.side);
  }
  setTransform(transform) {
    this.aside.content.transformSetter(transform);
  }
}
