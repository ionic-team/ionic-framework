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
 * The Action Sheet is a slide-up dialog that lets the user choose from a set
 * of options. Dangerous options are made obvious. There are easy ways to
 * cancel out of the action sheet, such as tapping the backdrop or even hitting
 * escape key on desktop.
 *
 * @usage
 * ```ts
 * ```
 *
 * @demo /docs/v2/demos/action-sheet/
 * @see {@link /docs/v2/components#action-sheets ActionSheet Component Docs}
 */
 export class ActionSheet extends ViewController {

   constructor(data={}) {
     data.buttons = data.buttons || [];

     super(ActionSheetCmp, data);
     this.viewType = 'action-sheet';
   }

   getTransitionName(direction) {
     let key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
     return this._nav && this._nav.config.get(key);
   }

   setTitle(title) {
     this.data.title = title;
   }

   setSubTitle(subTitle) {
     this.data.subTitle = subTitle;
   }

   addButton(button) {
     this.data.buttons.push(button);
   }

   static create(data={}) {
     return new ActionSheet(data);
   }

 }


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
      this.dismiss();
    }
  }

  dismiss() {
    this._viewCtrl.dismiss(this);
  }

  onPageLoaded() {
    // normalize the data
    let buttons = [];

    this.d.buttons.forEach(button => {
      if (typeof button === 'string') {
        button = { text: button };
      }

      if (button.style === 'cancel') {
        this.d.cancelButton = button;

      } else {
        if (button.style === 'destructive') {
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
