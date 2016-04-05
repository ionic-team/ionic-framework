import {Component, Renderer, ElementRef, HostListener} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {Spinner} from '../spinner/spinner';
import {isPresent, isUndefined, isDefined} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';


/**
 * @name Loading
 * @description
 * An overlay that can be used to indicate activity while blocking user
 * interaction. The loading indicator appears on top of the app's content,
 * and can be dismissed by the app to resume user interaction with
 * the app. It includes an optional backdrop, which can be disabled
 * by setting `showBackdrop: false` upon creation.
 *
 * ### Creating
 * You can pass all of the loading options in the first argument of
 * the create method: `Loading.create(opts)`. The spinner name should be
 * passed in the `spinner` property, and any optional HTML can be passed
 * in the `content` property. If you do not pass a value to `spinner`
 * the loading indicator will use the spinner specified by the mode. To
 * set the spinner name across the app, set the value of `loadingSpinner`
 * in your app's config. To hide the spinner, set `loadingSpinner: 'hide'`
 * in the apps' config or pass `spinner: 'hide'` in the loading
 * options. See the create method below for all available options.
 *
 * ### Dismissing
 * The loading indicator can be dismissed automatically after a specific
 * amount of time by passing the number of milliseconds to display it in
 * the `duration` of the loading options. By default the loading indicator
 * will show even during page changes, but this can be disabled by setting
 * `dismissOnPageChange` to `true`. To dismiss the loading indicator after
 * creation, call the `dismiss()` method on the Loading instance.
 *
 * ### Limitations
 * The element is styled to appear on top of other content by setting its
 * `z-index` property. You must ensure no element has a stacking context with
 * a higher `z-index` than this element.
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentLoadingDefault() {
 *   let loading = Loading.create({
 *     content: 'Please wait...'
 *   });
 *
 *   this.nav.present(loading);
 *
 *   setTimeout(() => {
 *     loading.dismiss();
 *   }, 5000);
 * }
 *
 * presentLoadingCustom() {
 *   let loading = Loading.create({
 *     spinner: 'hide',
 *     content: `
 *       <div class="custom-spinner-container">
 *         <div class="custom-spinner-box"></div>
 *       </div>`,
 *     duration: 5000
 *   });
 *
 *   this.nav.present(loading);
 * }
 *
 * presentLoadingText() {
 *   let loading = Loading.create({
 *     spinner: 'hide',
 *     content: 'Loading Please Wait...'
 *   });
 *
 *   this.nav.present(loading);
 *
 *   setTimeout(() => {
 *     this.nav.push(Page2);
 *   }, 1000);
 *
 *   setTimeout(() => {
 *     loading.dismiss();
 *   }, 5000);
 * }
 * ```
 *
 * @demo /docs/v2/demos/loading/
 * @see {@link /docs/v2/api/components/spinner/Spinner Spinner API Docs}
 */
export class Loading extends ViewController {

  constructor(opts: LoadingOptions = {}) {
    opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
    opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;

    super(LoadingCmp, opts);
    this.viewType = 'loading';
    this.isOverlay = true;
    this.usePortal = true;

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
    * Create a loading indicator with the following options
    *
    * | Option                | Type       | Description                                                                                                      |
    * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
    * | spinner               |`string`    | The name of the SVG spinner for the loading indicator.                                                                           |
    * | content               |`string`    | The html content for the loading indicator.                                                                      |
    * | cssClass              |`string`    | An additional class for custom styles.                                                                           |
    * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
    * | dismissOnPageChange   |`boolean`   | Whether to dismiss the indicator when navigating to a new page. Default false.                                   |
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
    '<div disable-activated class="backdrop" [class.hide-backdrop]="!d.showBackdrop" role="presentation"></div>' +
    '<div class="loading-wrapper">' +
      '<div *ngIf="showSpinner" class="loading-spinner">' +
        '<ion-spinner [name]="d.spinner"></ion-spinner>' +
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
  private showSpinner: boolean;

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

  ngOnInit() {
    // If no spinner was passed in loading options we need to fall back
    // to the loadingSpinner in the app's config, then the mode spinner
    if (isUndefined(this.d.spinner)) {
      this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
    }

    // If the user passed hide to the spinner we don't want to show it
    this.showSpinner = isDefined(this.d.spinner) && this.d.spinner !== 'hide';
  }

  onPageDidEnter() {
    let activeElement: any = document.activeElement;
    if (document.activeElement) {
      activeElement.blur();
    }

    // If there is a duration, dismiss after that amount of time
    this.d.duration ? setTimeout(() => this.dismiss('backdrop'), this.d.duration) : null;
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
  spinner?: string;
  content?: string;
  showBackdrop?: boolean;
  dismissOnPageChange?: boolean;
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
