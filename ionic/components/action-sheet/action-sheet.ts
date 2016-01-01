import {Component, Renderer} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {NavParams} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Config} from '../../config/config';
import {Icon} from '../icon/icon';
import {Animation} from '../../animations/animation';


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
 * including properties for its `text`, and optionally a `style` and `handler`.
 * If a handler returns `false` then the action sheet will not be dismissed. An
 * action sheet can also optionally have a `title` and a `subTitle`.
 *
 * A button's `style` property can either be `destructive` or `cancel`. Buttons
 * without a style property will have a default style for its platform. Buttons
 * with the `cancel` style will always load as the bottom button, no matter where
 * it shows up in the array. All other buttons will show up in the order they
 * have been added to the `buttons` array. Note: We recommend that `destructive`
 * buttons show be the first button in the array, making it the button on top.
 *
 * Its shorthand is to add all the action sheet's options from within the
 * `ActionSheet.create(opts)` first argument. Otherwise the action sheet's
 * instance has methods to add options, such as `setTitle()` or `addButton()`.
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
 *         style: 'destructive',
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
 *         style: 'cancel',
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

   constructor(opts={}) {
     opts.buttons = opts.buttons || [];

     super(ActionSheetCmp, opts);
     this.viewType = 'action-sheet';
   }

   /**
   * @private
   */
   getTransitionName(direction) {
     let key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
     return this._nav && this._nav.config.get(key);
   }

   /**
    * @param {string} title Action sheet title
    */
   setTitle(title) {
     this.data.title = title;
   }

   /**
    * @param {string} subTitle Action sheet subtitle
    */
   setSubTitle(subTitle) {
     this.data.subTitle = subTitle;
   }

   /**
    * @param {Object} button Action sheet button
    */
   addButton(button) {
     this.data.buttons.push(button);
   }

   /**
    * @param {Object} opts Action sheet options
    */
   static create(opts={}) {
     return new ActionSheet(opts);
   }

 }

/**
* @private
*/
@Component({
  selector: 'ion-action-sheet',
  template:
    '<div (click)="dismiss()" tappable disable-activated class="backdrop" role="presentation"></div>' +
    '<div class="action-sheet-wrapper">' +
      '<div class="action-sheet-container">' +
        '<div class="action-sheet-group action-sheet-options">' +
          '<div class="action-sheet-title" *ngIf="d.title">{{d.title}}</div>' +
          '<div class="action-sheet-sub-title" *ngIf="d.subTitle">{{d.subTitle}}</div>' +
          '<button (click)="click(b)" *ngFor="#b of d.buttons" class="action-sheet-button action-sheet-option disable-hover" [ngClass]="b.cssClass">' +
            '<icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></icon> ' +
            '{{b.text}}' +
          '</button>' +
        '</div>' +
        '<div class="action-sheet-group" *ngIf="d.cancelButton">' +
          '<button (click)="click(d.cancelButton)" class="action-sheet-button action-sheet-cancel disable-hover" [ngClass]="d.cancelButton.cssClass">' +
            '<icon [name]="d.cancelButton.icon" *ngIf="d.cancelButton.icon" class="action-sheet-icon"></icon> ' +
            '{{d.cancelButton.text}}' +
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

  constructor(
    private _viewCtrl: ViewController,
    private _config: Config,
    params: NavParams, renderer: Renderer
  ) {
    this.d = params.data;

    if (this.d.cssClass) {
      renderer.setElementClass(elementRef, this.d.cssClass, true);
    }
  }

  click(button) {
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
        this.dismiss();
      }, this._config.get('pageTransitionDelay'));
    }
  }

  dismiss() {
    this._viewCtrl.dismiss();
  }

  onPageLoaded() {
    // normalize the data
    let buttons = [];

    this.d.buttons.forEach(button => {
      if (typeof button === 'string') {
        button = { text: button };
      }

      if (button.style === 'cancel') {
        if (!button.icon) {
          button.icon = this._config.get('actionSheetCancelIcon');
        }
        this.d.cancelButton = button;

      } else {
        if (button.style === 'destructive') {
          if (!button.icon) {
            button.icon = this._config.get('actionSheetDestructiveIcon');
          }
          button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
        }
        buttons.push(button);
      }
    });

    this.d.buttons = buttons;

    let self = this;
    self.keyUp = function(ev) {
      if (ev.keyCode === 27) {
        console.debug('actionsheet escape');
        self.dismiss();
      }
    };

    document.addEventListener('keyup', this.keyUp);
  }

  onPageDidLeave() {
    document.removeEventListener('keyup', this.keyUp);
  }
}



class ActionSheetSlideIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.4);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-slide-in', ActionSheetSlideIn);


class ActionSheetSlideOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.4, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-slide-out', ActionSheetSlideOut);


class ActionSheetMdSlideIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.01, 0.26);
    wrapper.fromTo('translateY', '100%', '0%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-md-slide-in', ActionSheetMdSlideIn);


class ActionSheetMdSlideOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.action-sheet-wrapper'));

    backdrop.fromTo('opacity', 0.26, 0);
    wrapper.fromTo('translateY', '0%', '100%');

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add([backdrop, wrapper]);
  }
}
Animation.register('action-sheet-md-slide-out', ActionSheetMdSlideOut);
