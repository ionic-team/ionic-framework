import {Component, Renderer, ElementRef, HostListener} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {Spinner} from '../spinner/spinner';
import {isPresent} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';


/**
 * @name Loading
 * @description
 */
export class Loading extends ViewController {

  constructor(opts: LoadingOptions = {}) {
    opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : false;
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;

    super(LoadingCmp, opts);
    this.viewType = 'loading';
    this.isOverlay = true;

    // by default, loading indicators should not fire lifecycle events of other views
    // for example, when an loading indicators enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
  }

   /**
   * @private
   */
   getTransitionName(direction: string) {
     let key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
     return this._nav && this._nav.config.get(key);
   }

   /**
    * Open a loading indicator with the following options
    *
    * | Option                | Type       | Description                                                                                                      |
    * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
    * | icon                  |`string`    | The spinner icon for the loading indicator.                                                                           |
    * | content               |`string`    | The html content for the loading indicator.                                                                      |
    * | cssClass              |`string`    | An additional class for custom styles.                                                                           |
    * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
    * | dismissOnPageChange   |`boolean`   | Whether to dismiss the indicator when navigating to a new page. Default false.                                   |
    * | enableBackdropDismiss |`boolean`   | If the loading should close when the user taps the backdrop. Default false.                                      |
    * | delay                 |`number`    | How many milliseconds to delay showing the indicator. Default 0.                                                 |
    * | duration              |`number`    | How many milliseconds to wait before hiding the indicator. By default, it will show until `hide()` is called.    |
    *
    *
    * @param {object} opts Loading options
    */
   static create(opts: LoadingOptions = {}) {
     return new Loading(opts);
   }

 }

/**
* @private
*/
@Component({
  selector: 'ion-loading',
  template:
    '<div (click)="bdClick()" tappable disable-activated class="backdrop" [class.hide-backdrop]="!d.showBackdrop" role="presentation"></div>' +
    '<div class="loading-wrapper">' +
      '<div *ngIf="d.icon" class="loading-spinner">' +
        '<ion-spinner [name]="d.icon == \'platform\' ? null : d.icon"></ion-spinner>' +
      '</div>' +
      '<div *ngIf="d.content" [innerHTML]="d.content" class="loading-content"></div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  directives: [NgIf, Spinner]
})
class LoadingCmp {
  private d: any;
  private id: number;
  private created: number;

  constructor(
    private _viewCtrl: ViewController,
    private _config: Config,
    private _elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;
    this.created = Date.now();

    if (this.d.cssClass) {
      renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
    }

    this.id = (++loadingIds);
  }

  onPageDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }

    // If there is a duration, dismiss after that amount of time
    this.d.duration ? setTimeout(() => this.dismiss('backdrop'), this.d.duration) : null;
  }

  @HostListener('body:keyup', ['$event'])
  private _keyUp(ev: KeyboardEvent) {
    if (this.isEnabled() && this._viewCtrl.isLast()) {
      if (ev.keyCode === 27) {
        console.debug('loading, escape button');
        this.bdClick();
      }
    }
  }

  bdClick() {
    if (this.isEnabled() && this.d.enableBackdropDismiss) {
      this.dismiss('backdrop');
    }
  }

  dismiss(role): Promise<any> {
    return this._viewCtrl.dismiss(null, role);
  }

  isEnabled() {
    let tm = this._config.getNumber('overlayCreatedDiff', 750);
    return (this.created + tm < Date.now());
  }
}

export interface LoadingOptions {
  icon?: string;
  content?: string;
  showBackdrop?: boolean;
  dismissOnPageChange?: boolean;
  enableBackdropDismiss?: boolean;
  delay?: number;
  duration?: number;
}

/**
 * Animations for loading
 */
 class LoadingPopIn extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = enteringView.pageRef().nativeElement;
     let backdrop = new Animation(ele.querySelector('.backdrop'));
     let wrapper = new Animation(ele.querySelector('.loading-wrapper'));

     wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
     backdrop.fromTo('opacity', '0.01', '0.3');

     this
       .easing('ease-in-out')
       .duration(200)
       .add(backdrop)
       .add(wrapper);
   }
 }
 Transition.register('loading-pop-in', LoadingPopIn);


 class LoadingPopOut extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = leavingView.pageRef().nativeElement;
     let backdrop = new Animation(ele.querySelector('.backdrop'));
     let wrapper = new Animation(ele.querySelector('.loading-wrapper'));

     wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
     backdrop.fromTo('opacity', '0.3', '0');

     this
       .easing('ease-in-out')
       .duration(200)
       .add(backdrop)
       .add(wrapper);
   }
 }
 Transition.register('loading-pop-out', LoadingPopOut);


 class LoadingMdPopIn extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = enteringView.pageRef().nativeElement;
     let backdrop = new Animation(ele.querySelector('.backdrop'));
     let wrapper = new Animation(ele.querySelector('.loading-wrapper'));

     wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
     backdrop.fromTo('opacity', '0.01', '0.50');

     this
       .easing('ease-in-out')
       .duration(200)
       .add(backdrop)
       .add(wrapper);
   }
 }
 Transition.register('loading-md-pop-in', LoadingMdPopIn);


 class LoadingMdPopOut extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = leavingView.pageRef().nativeElement;
     let backdrop = new Animation(ele.querySelector('.backdrop'));
     let wrapper = new Animation(ele.querySelector('.loading-wrapper'));

     wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
     backdrop.fromTo('opacity', '0.50', '0');

     this
       .easing('ease-in-out')
       .duration(200)
       .add(backdrop)
       .add(wrapper);
   }
 }
 Transition.register('loading-md-pop-out', LoadingMdPopOut);


 class LoadingWpPopIn extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = enteringView.pageRef().nativeElement;
     let backdrop = new Animation(ele.querySelector('.backdrop'));
     let wrapper = new Animation(ele.querySelector('.loading-wrapper'));

     wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.3', '1');
     backdrop.fromTo('opacity', '0.01', '0.16');

     this
       .easing('cubic-bezier(0,0 0.05,1)')
       .duration(200)
       .add(backdrop)
       .add(wrapper);
   }
 }
 Transition.register('loading-wp-pop-in', LoadingWpPopIn);


 class LoadingWpPopOut extends Transition {
   constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
     super(opts);

     let ele = leavingView.pageRef().nativeElement;
     let backdrop = new Animation(ele.querySelector('.backdrop'));
     let wrapper = new Animation(ele.querySelector('.loading-wrapper'));

     wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '1.3');
     backdrop.fromTo('opacity', '0.16', '0');

     this
       .easing('ease-out')
       .duration(150)
       .add(backdrop)
       .add(wrapper);
   }
 }
 Transition.register('loading-wp-pop-out', LoadingWpPopOut);

let loadingIds = -1;
