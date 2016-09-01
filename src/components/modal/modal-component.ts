import { Component, ComponentFactoryResolver, HostListener, Renderer, ViewChild, ViewContainerRef } from '@angular/core';

import { Animation } from '../../animations/animation';
import { Key } from '../../util/key';
import { NavParams } from '../../navigation/nav-params';
import { pascalCaseToDashCase } from '../../util/util';
import { PageTransition } from '../../transitions/page-transition';
import { ViewController } from '../../navigation/view-controller';
import { windowDimensions } from '../../util/dom';


/**
 * @private
 */
@Component({
  selector: 'ion-modal',
  template:
    '<ion-backdrop disableScroll="false" (click)="_bdClick()"></ion-backdrop>' +
    '<div class="modal-wrapper">' +
      '<div #viewport nav-viewport></div>' +
    '</div>'
})
export class ModalCmp {

  @ViewChild('viewport', { read: ViewContainerRef }) _viewport: ViewContainerRef;

  /** @private  */
  _bdDismiss: boolean;

  /** @private */
  _enabled: boolean;

  constructor(public _cfr: ComponentFactoryResolver, public _renderer: Renderer, public _navParams: NavParams, public _viewCtrl: ViewController) {
    this._bdDismiss = _navParams.data.opts.enableBackdropDismiss;
  }

  ngAfterViewInit() {
    this._load(this._navParams.data.component);
  }

  /** @private */
  _load(component: any) {
    if (component) {
      const componentFactory = this._cfr.resolveComponentFactory(component);

      // ******** DOM WRITE ****************
      const componentRef = this._viewport.createComponent(componentFactory, this._viewport.length, this._viewport.parentInjector, []);
      this._viewCtrl._setInstance(componentRef.instance);

      this._setCssClass(componentRef, 'ion-page');
      this._setCssClass(componentRef, 'show-page');
      this._setCssClass(componentRef, pascalCaseToDashCase(component.name));
      this._enabled = true;
    }
  }

  /** @private */
  _setCssClass(componentRef: any, className: string) {
    this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
  }

  _bdClick() {
    if (this._enabled && this._bdDismiss) {
      return this._viewCtrl.dismiss(null, 'backdrop');
    }
  }

  @HostListener('body:keyup', ['$event'])
  _keyUp(ev: KeyboardEvent) {
    if (this._enabled && this._viewCtrl.isLast() && ev.keyCode === Key.ESCAPE) {
      this._bdClick();
    }
  }
}

/**
 * Animations for modals
 */
 class ModalSlideIn extends PageTransition {
   init() {
     super.init();
     const ele: HTMLElement = this.enteringView.pageRef().nativeElement;
     const backdropEle = ele.querySelector('ion-backdrop');
     const backdrop = new Animation(backdropEle);
     const wrapper = new Animation(ele.querySelector('.modal-wrapper'));

     backdrop.fromTo('opacity', 0.01, 0.4);
     wrapper.fromTo('translateY', '100%', '0%');

     this
       .element(this.enteringView.pageRef())
       .easing('cubic-bezier(0.36,0.66,0.04,1)')
       .duration(400)
       .add(backdrop)
       .add(wrapper);
   }
 }
 PageTransition.register('modal-slide-in', ModalSlideIn);


class ModalSlideOut extends PageTransition {
  init() {
    super.init();
    const ele: HTMLElement = this.leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapperEle = <HTMLElement>ele.querySelector('.modal-wrapper');
    let wrapperEleRect = wrapperEle.getBoundingClientRect();
    let wrapper = new Animation(wrapperEle);

    // height of the screen - top of the container tells us how much to scoot it down
    // so it's off-screen
    let screenDimensions = windowDimensions();
    wrapper.fromTo('translateY', '0px', `${screenDimensions.height - wrapperEleRect.top}px`);
    backdrop.fromTo('opacity', 0.4, 0.0);

    this
      .element(this.leavingView.pageRef())
      .easing('ease-out')
      .duration(250)
      .add(backdrop)
      .add(wrapper);
  }
}
PageTransition.register('modal-slide-out', ModalSlideOut);


class ModalMDSlideIn extends PageTransition {
  init() {
    super.init();
    const ele: HTMLElement = this.enteringView.pageRef().nativeElement;
    const backdrop = new Animation(ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(ele.querySelector('.modal-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.4);
    wrapper.fromTo('translateY', '40px', '0px');
    wrapper.fromTo('opacity', 0.01, 1);

    const DURATION = 280;
    const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
    this.element(this.enteringView.pageRef()).easing(EASING).duration(DURATION)
      .add(backdrop)
      .add(wrapper);
  }
}
PageTransition.register('modal-md-slide-in', ModalMDSlideIn);


class ModalMDSlideOut extends PageTransition {
  init() {
    super.init();
    const ele: HTMLElement = this.leavingView.pageRef().nativeElement;
    const backdrop = new Animation(ele.querySelector('ion-backdrop'));
    const wrapper = new Animation(ele.querySelector('.modal-wrapper'));

    backdrop.fromTo('opacity', 0.4, 0.0);
    wrapper.fromTo('translateY', '0px', '40px');
    wrapper.fromTo('opacity', 0.99, 0);

    this
      .element(this.leavingView.pageRef())
      .duration(200)
      .easing('cubic-bezier(0.47,0,0.745,0.715)')
      .add(wrapper)
      .add(backdrop);
  }
}
PageTransition.register('modal-md-slide-out', ModalMDSlideOut);
