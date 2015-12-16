import {Component, Injectable, Renderer} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';

import {OverlayController} from '../overlay/overlay-controller';
import {Config} from '../../config/config';
import {Icon} from '../icon/icon';
import {Animation} from '../../animations/animation';
import {NavParams} from '../nav/nav-controller';
import {extend} from '../../util/util';

@Component({
  selector: 'ion-action-sheet',
  template:
    '<div (click)="cancel()" tappable disable-activated class="backdrop"></div>' +
    '<div class="action-sheet-wrapper">' +
      '<div class="action-sheet-container">' +
        '<div class="action-sheet-group action-sheet-options">' +
          '<div class="action-sheet-title" *ngIf="d.titleText">{{d.titleText}}</div>' +
          '<button (click)="buttonClicked(i)" *ngFor="#b of d.buttons; #i=index" class="action-sheet-button action-sheet-option disable-hover">' +
            '<icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></icon> ' +
            '{{b.text}}' +
          '</button>' +
          '<button *ngIf="d.destructiveText" (click)="destructive()" class="action-sheet-button action-sheet-destructive disable-hover">' +
            '<icon [name]="d.destructiveIcon" *ngIf="d.destructiveIcon" class="action-sheet-icon"></icon> ' +
            '{{d.destructiveText}}' +
          '</button>' +
        '</div>' +
        '<div class="action-sheet-group" *ngIf="d.cancelText">' +
          '<button (click)="cancel()" class="action-sheet-button action-sheet-cancel disable-hover">' +
            '<icon [name]="d.cancelIcon" *ngIf="d.cancelIcon" class="action-sheet-icon"></icon> ' +
            '{{d.cancelText}}' +
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

  constructor(params: NavParams, renderer: Renderer) {
    this.d = params.data;

    if (this.d.cssClass) {
      renderer.setElementClass(elementRef, this.d.cssClass, true);
    }
  }

  cancel() {
    this.d.cancel && this.d.cancel();
    return this.close();
  }

  destructive() {
    if (this.d.destructiveButtonClicked()) {
      return this.close();
    }
  }

  buttonClicked(index) {
    if (this.d.buttonClicked(index)) {
      return this.close();
    }
  }
}

/**
 * @name ActionSheet
 * @description
 * The Action Sheet is a slide-up pane that lets the user choose from a set of options. Dangerous options are made obvious.
 * There are easy ways to cancel out of the action sheet, such as tapping the backdrop or even hitting escape on the keyboard for desktop testing.
 *
 * @usage
 * ```ts
 * openMenu() {
 *
 *   this.actionSheet.open({
 *     buttons: [
 *       { text: 'Share This' },
 *       { text: 'Move' }
 *     ],
 *     destructiveText: 'Delete',
 *     titleText: 'Modify your album',
 *     cancelText: 'Cancel',
 *     cancel: function() {
 *       console.log('Canceled');
 *     },
 *     destructiveButtonClicked: () => {
 *       console.log('Destructive clicked');
 *     },
 *     buttonClicked: function(index) {
 *       console.log('Button clicked', index);
 *       if(index == 1) { return false; }
 *       return true;
 *     }
 *
 *   }).then(actionSheetRef => {
 *     this.actionSheetRef = actionSheetRef;
 *   });
 *
 * }
 * ```
 *
 * @demo /docs/v2/demos/action-sheet/
 * @see {@link /docs/v2/components#action-sheets ActionSheet Component Docs}
 */
@Injectable()
export class ActionSheet {

  constructor(ctrl: OverlayController, config: Config) {
    this.ctrl = ctrl;
    this.config = config;
  }

  /**
   * Create and open a new Action Sheet. This is the
   * public API, and most often you will only use ActionSheet.open()
   *
   * @param {Object} [opts={}]  An object containing optional settings.
   *  - `[Object]` `buttons` Which buttons to show.  Each button is an object with a `text` field.
   *  - `{string}` `titleText` The title to show on the action sheet.
   *  - `{string=}` `cancelText` the text for a 'cancel' button on the action sheet.
   *  - `{string=}` `destructiveText` The text for a 'danger' on the action sheet.
   *  - `{function=}` `cancel` Called if the cancel button is pressed, the backdrop is tapped or
   *     the hardware back button is pressed.
   *  - `{function=}` `buttonClicked` Called when one of the non-destructive buttons is clicked,
   *     with the index of the button that was clicked and the button object. Return true to close
   *     the action sheet, or false to keep it opened.
   *  - `{function=}` `destructiveButtonClicked` Called when the destructive button is clicked.
   *     Return true to close the action sheet, or false to keep it opened.
   * @param {String} [opts.enterAnimation='action-sheet-slide-in'] The class used to animate an actionSheet that is entering.
   * @param {String} [opts.leaveAnimation='action-sheet-slide-out'] The class used to animate an actionSheet that is leaving.
   * @return {Promise} Promise that resolves when the action sheet is open.
   */
  open(opts={}) {
    opts = extend({
      pageType: OVERLAY_TYPE,
      enterAnimation: this.config.get('actionSheetEnter'),
      leaveAnimation: this.config.get('actionSheetLeave'),
      cancelIcon: this.config.get('actionSheetCancelIcon'),
      destructiveIcon: this.config.get('actionSheetDestructiveIcon')
    }, opts);

    return this.ctrl.open(ActionSheetCmp, opts, opts);
  }

  /**
   * Retrieves an actionSheet instance.
   *
   * @param {String} [handle]  The handle used to open the instance to be retrieved.
   * @returns {ActionSheet} An actionSheet instance.
   */
  get(handle) {
    if (handle) {
      return this.ctrl.getByHandle(handle);
    }
    return this.ctrl.getByType(OVERLAY_TYPE);
  }

}

const OVERLAY_TYPE = 'action-sheet';



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
