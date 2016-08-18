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
    '<ion-backdrop disableScroll="false" (click)="bdClick()"></ion-backdrop>' +
    '<div class="modal-wrapper">' +
      '<div #viewport nav-viewport></div>' +
    '</div>'
})
export class ModalCmp {
  @ViewChild('viewport', {read: ViewContainerRef}) viewport: ViewContainerRef;
  d: any;
  enabled: boolean;

  constructor(public _cfr: ComponentFactoryResolver, public _renderer: Renderer, public _navParams: NavParams, public _viewCtrl: ViewController) {
    this.d = _navParams.data.opts;
  }

  ngAfterViewInit() {
    this.loadComponent(this._navParams.data.componentType);
  }

  loadComponent(componentType: any) {
    if (componentType) {
      const componentFactory = this._cfr.resolveComponentFactory(componentType);

      // ******** DOM WRITE ****************
      const componentRef = this.viewport.createComponent(componentFactory, this.viewport.length, this.viewport.parentInjector, []);
      this.setCssClass(componentRef, 'ion-page');
      this.setCssClass(componentRef, 'show-page');
      this.setCssClass(componentRef, pascalCaseToDashCase(componentType.name));
      this._viewCtrl._setInstance(componentRef.instance);
      this.enabled = true;
    }
  }

  setCssClass(componentRef: any, className: string) {
    this._renderer.setElementClass(componentRef.location.nativeElement, className, true);
  }

  dismiss(role: any): Promise<any> {
    return this._viewCtrl.dismiss(null, role);
  }

  bdClick() {
    if (this.enabled && this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  @HostListener('body:keyup', ['$event'])
  keyUp(ev: KeyboardEvent) {
    if (this.enabled && this._viewCtrl.isLast() && ev.keyCode === Key.ESCAPE) {
      this.bdClick();
    }
  }
}

/**
 * Animations for modals
 */
 class ModalSlideIn extends PageTransition {
   init() {
     let ele = this.enteringView.pageRef().nativeElement;
     let backdropEle = ele.querySelector('ion-backdrop');
     let backdrop = new Animation(backdropEle);
     let wrapper = new Animation(ele.querySelector('.modal-wrapper'));

     backdrop.fromTo('opacity', 0.01, 0.4);
     wrapper.fromTo('translateY', '100%', '0%');


     this
       .element(this.enteringView.pageRef())
       .easing('cubic-bezier(0.36,0.66,0.04,1)')
       .duration(400)
       .add(backdrop)
       .add(wrapper);

     if (this.enteringView.hasNavbar()) {
       // entering page has a navbar
       let enteringNavBar = new Animation(ele.querySelector('ion-navbar'));
       enteringNavBar.beforeAddClass('show-navbar');
       this.add(enteringNavBar);
     }
   }
 }
 PageTransition.register('modal-slide-in', ModalSlideIn);


class ModalSlideOut extends PageTransition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapperEle = <HTMLElement> ele.querySelector('.modal-wrapper');
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
    let ele = this.enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.modal-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.4);
    wrapper.fromTo('translateY', '40px', '0px');
    wrapper.fromTo('opacity', 0.01, 1);

    const DURATION = 280;
    const EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
    this.element(this.enteringView.pageRef()).easing(EASING).duration(DURATION)
      .add(backdrop)
      .add(wrapper);

    if (this.enteringView.hasNavbar()) {
      // entering page has a navbar
      let enteringNavBar = new Animation(ele.querySelector('ion-navbar'));
      enteringNavBar.beforeAddClass('show-navbar');
      this.add(enteringNavBar);
    }
  }
}
PageTransition.register('modal-md-slide-in', ModalMDSlideIn);


class ModalMDSlideOut extends PageTransition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('ion-backdrop'));
    let wrapper = new Animation(ele.querySelector('.modal-wrapper'));

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
