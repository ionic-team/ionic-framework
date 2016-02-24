import {Component, Renderer, ElementRef} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {Animation} from '../../animations/animation';
import {Transition, TransitionOptions} from '../../transitions/transition';
import {Config} from '../../config/config';
import {Icon} from '../icon/icon';
import {isDefined} from '../../util/util';
import {NavParams} from '../nav/nav-params';
import {ViewController} from '../nav/view-controller';


/**
 * @name ActionSheet
 * @description
 * An Action Sheet is a dialog that lets the user choose from a set of
 * options. It appears on top of the app's content, and must be manually
 * dismissed by the user before they can resume interaction with the app.
 * Dangerous (destructive) options are made obvious. There are easy
 * ways to cancel out of the action sheet, such as tapping the backdrop or
 * hitting the escape key on desktop. 
 *
 * An action sheet is created from an array of `buttons`, with each button
 * including properties for its `text`, and optionally a `handler` and `role`.
 * If a handler returns `false` then the action sheet will not be dismissed. An
 * action sheet can also optionally have a `title` and a `subTitle`.
 *
 * A button's `role` property can either be `destructive` or `cancel`. Buttons
 * without a role property will have a default look for its platform. Buttons
 * with the `cancel` role will always load as the bottom button, no matter where
 * it shows up in the array. All other buttons will show up in the order they
 * have been added to the `buttons` array. Note: We recommend that `destructive`
 * buttons show be the first button in the array, making it the button on top.
 * Additionally, if the action sheet is dismissed by tapping the backdrop, then
 * it will fire the handler from the button with the cancel role.
 *
 * Its shorthand is to add all the action sheet's options from within the
 * `ActionSheet.create(opts)` first argument. Otherwise the action sheet's
 * instance has methods to add options, like `setTitle()` or `addButton()`.
 *
 * @usage
 * ```ts
 * constructor(nav: NavController) {
 *   this.nav = nav;
 * }
 *
 * presentActionSheet() {
 *   let actionSheet = ActionSheet.create({
 *     title: 'Modify your album',
 *     buttons: [
 *       {
 *         text: 'Destructive',
 *         role: 'destructive',
 *         handler: () => {
 *           console.log('Destructive clicked');
 *         }
 *       },
 *       {
 *         text: 'Archive',
 *         handler: () => {
 *           console.log('Archive clicked');
 *         }
 *       },
 *       {
 *         text: 'Cancel',
 *         role: 'cancel',
 *         handler: () => {
 *           console.log('Cancel clicked');
 *         }
 *       }
 *     ]
 *   });
 *
 *   this.nav.present(actionSheet);
 * }
 * ```
 *
 * @demo /docs/v2/demos/action-sheet/
 * @see {@link /docs/v2/components#action-sheets ActionSheet Component Docs}
 */
export class ActionSheet extends ViewController {

  constructor(opts: ActionSheetOptions = {}) {
    opts.buttons = opts.buttons || [];
    opts.enableBackdropDismiss = isDefined(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;

    super(ActionSheetCmp, opts);
    this.viewType = 'action-sheet';
    this.isOverlay = true;

    // by default, actionsheets should not fire lifecycle events of other views
    // for example, when an actionsheets enters, the current active view should
    // not fire its lifecycle events because it's not conceptually leaving
    this.fireOtherLifecycles = false;
  }

   /**
   * @private
   */
   getTransitionName(direction: string) {
     let key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
     return this._nav && this._nav.config.get(key);
   }

   /**
    * @param {string} title Action sheet title
    */
   setTitle(title: string) {
     this.data.title = title;
   }

   /**
    * @param {string} subTitle Action sheet subtitle
    */
   setSubTitle(subTitle: string) {
     this.data.subTitle = subTitle;
   }

   /**
    * @param {object} button Action sheet button
    */
   addButton(button: any) {
     this.data.buttons.push(button);
   }

   /**
    * Open an action sheet with the following options
    *
    * | Option                | Type       | Description                                                     |
    * |-----------------------|------------|-----------------------------------------------------------------|
    * | title                 |`string`    | The title for the actionsheet                                   |
    * | subTitle              |`string`    | The sub-title for the actionsheet                               |
    * | cssClass              |`string`    | An additional class for custom styles                           |
    * | enableBackdropDismiss |`boolean`   | If the actionsheet should close when the user taps the backdrop |
    * | buttons               |`array<any>`| An array of buttons to display                                  |
    *
    * For the buttons:
    *
    * | Option   | Type     | Description                                                                                                                                      |
    * |----------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------|
    * | text     | `string` | The buttons text                                                                                                                                 |
    * | icon     | `icon`   | The buttons icons                                                                                                                                |
    * | handler  | `any`    | An express the button shoule evaluate                                                                                                            |
    * | cssClass | `string` | An additional class for custom styles                                                                                                            |
    * | role     | `string` | How the button should be displayed, `destructive` or `cancel`. If not role is provided, it will display the button without any additional styles |
    *
    *
    *
    * @param {object} opts Action sheet options
    */
   static create(opts: ActionSheetOptions = {}) {
     return new ActionSheet(opts);
   }

 }

/**
* @private
*/
@Component({
  selector: 'ion-action-sheet',
  template:
    '<div (click)="bdClick()" tappable disable-activated class="backdrop" role="presentation"></div>' +
    '<div class="action-sheet-wrapper">' +
      '<div class="action-sheet-container">' +
        '<div class="action-sheet-group">' +
          '<div class="action-sheet-title" *ngIf="d.title">{{d.title}}</div>' +
          '<div class="action-sheet-sub-title" *ngIf="d.subTitle">{{d.subTitle}}</div>' +
          '<button (click)="click(b)" *ngFor="#b of d.buttons" class="action-sheet-button disable-hover" [ngClass]="b.cssClass">' +
            '<ion-icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></ion-icon> ' +
            '{{b.text}}' +
            '<ion-button-effect></ion-button-effect>' +
          '</button>' +
        '</div>' +
        '<div class="action-sheet-group" *ngIf="d.cancelButton">' +
          '<button (click)="click(d.cancelButton)" class="action-sheet-button action-sheet-cancel disable-hover" [ngClass]="d.cancelButton.cssClass">' +
            '<ion-icon [name]="d.cancelButton.icon" *ngIf="d.cancelButton.icon" class="action-sheet-icon"></ion-icon> ' +
            '{{d.cancelButton.text}}' +
            '<ion-button-effect></ion-button-effect>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  directives: [NgFor, NgIf, Icon]
})
class ActionSheetCmp {
  private d: any;
  private keyUp: EventListener;

  constructor(
    private _viewCtrl: ViewController,
    private _config: Config,
    elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;

    if (this.d.cssClass) {
      renderer.setElementClass(elementRef.nativeElement, this.d.cssClass, true);
    }
  }

  onPageLoaded() {
    // normalize the data
    let buttons = [];

    this.d.buttons.forEach(button => {
      if (typeof button === 'string') {
        button = { text: button };
      }
      if (!button.cssClass) {
        button.cssClass = '';
      }

      // deprecated warning
      if (button.style) {
        console.warn('Alert "style" property has been renamed to "role"');
        button.role = button.style;
      }

      if (button.role === 'cancel') {
        this.d.cancelButton = button;

      } else {
        if (button.role === 'destructive') {
          button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
        }
        buttons.push(button);
      }
    });

    this.d.buttons = buttons;

    let self = this;
    self.keyUp = function(ev: KeyboardEvent) {
      if (ev.keyCode === 27) {
        console.debug('actionsheet escape');
        self.bdClick();
      }
    };

    document.addEventListener('keyup', this.keyUp);
  }

  click(button, dismissDelay?) {
    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, execute it
      if (button.handler() === false) {
        // if the return value of the handler is false then do not dismiss
        shouldDismiss = false;
      }
    }

    if (shouldDismiss) {
      setTimeout(() => {
        this.dismiss(button.role);
      }, dismissDelay || this._config.get('pageTransitionDelay'));
    }
  }

  bdClick() {
    if (this.d.enableBackdropDismiss) {
      if (this.d.cancelButton) {
        this.click(this.d.cancelButton, 1);

      } else {
        this.dismiss('backdrop');
      }
    }
  }

  dismiss(role): Promise<any> {
    return this._viewCtrl.dismiss(null, role);
  }

  onPageWillLeave() {
    document.removeEventListener('keyup', this.keyUp);
  }

  ngOnDestroy() {
    document.removeEventListener('keyup', this.keyUp);
  }
}

export interface ActionSheetOptions {
  title?: string;
  subTitle?: string;
  cssClass?: string;
  buttons?: Array<any>;
  enableBackdropDismiss?: boolean;
}


class ActionSheetSlideIn extends Transition {
  constructor(enteringView, leavingView, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.4);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
  }
}
Transition.register('action-sheet-slide-in', ActionSheetSlideIn);


class ActionSheetSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.4, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(backdrop).add(wrapper);
  }
}
Transition.register('action-sheet-slide-out', ActionSheetSlideOut);


class ActionSheetMdSlideIn extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.26);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
  }
}
Transition.register('action-sheet-md-slide-in', ActionSheetMdSlideIn);


class ActionSheetMdSlideOut extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.26, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
  }
}
Transition.register('action-sheet-md-slide-out', ActionSheetMdSlideOut);
