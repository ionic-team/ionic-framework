import {Component, ElementRef, Renderer} from 'angular2/core';
import {NgClass, NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import {NavParams} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Animation} from '../../animations/animation';
import {Button} from '../button/button';
import {extend, isDefined} from '../../util/util';


export class Alert extends ViewController {

  constructor(opts={}) {
    super(null, AlertCmp, opts);

    this.data.inputs = this.data.inputs || [];
    let buttons = this.data.buttons || [];
    this.data.buttons = [];
    for (let button of buttons) {
      this.addButton(button);
    }

    this.enterAnimationKey = 'alertEnter';
    this.leaveAnimationKey = 'alertLeave';
  }

  setTitle(title) {
    this.data.title = title;
  }

  setSubTitle(subTitle) {
    this.data.subTitle = subTitle;
  }

  setBody(body) {
    this.data.body = body;
  }

  addInput(input) {
    input.value = isDefined(input.value) ? input.value : '';
    this.data.inputs.push(input);
  }

  addButton(button) {
    if (typeof button === 'string') {
      button = {
        text: button
      };
    }
    this.data.buttons.push(button);
  }

  close() {
    let index = this._nav.indexOf(this);
    this._nav.remove(index, { animateFirst: true });
  }

  onClose(handler) {
    this.data.onClose = handler;
  }

  static create(opts={}) {
    return new Alert(opts);
  }

}


@Component({
  selector: 'ion-alert',
  template:
    '<div (click)="close()" tappable disable-activated class="backdrop" role="presentation"></div>' +
    '<div class="alert-wrapper">' +
      '<div class="alert-head">' +
        '<h2 class="alert-title" *ngIf="d.title">{{d.title}}</h2>' +
        '<h3 class="alert-sub-title" *ngIf="d.subTitle">{{d.subTitle}}</h3>' +
      '</div>' +
      '<div class="alert-body" *ngIf="d.body">{{d.body}}</div>' +
      '<div class="alert-body alert-inputs" *ngIf="d.inputs.length">' +
        '<div class="alert-input-wrapper" *ngFor="#i of d.inputs">' +
          '<div class="alert-input-title" *ngIf="i.title">{{i.title}}</div>' +
          '<input [placeholder]="i.placeholder" [(ngModel)]="i.input" [value]="i.value" class="alert-input">' +
        '</div>' +
      '</div>' +
      '<div class="alert-buttons">' +
        '<button *ngFor="#b of d.buttons" (click)="click(b)" [ngClass]="b.cssClass" class="alert-button">' +
          '{{b.text}}' +
        '</button>' +
      '</div>' +
    '</div>',
  host: {
    'role': 'dialog'
  },
  directives: [NgClass, NgIf, NgFor]
})
class AlertCmp {

  constructor(
    private _viewCtrl: ViewController,
    elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;
    if (this.d.cssClass) {
      renderer.setElementClass(elementRef, this.d.cssClass, true);
    }
  }

  click(button, ev) {
    let shouldClose = true;

    if (button.handler) {
      // a handler has been provided, run it
      if (button.handler(this.getValue()) === false) {
        // if the return value is a false then do not close
        shouldClose = false;
      }
    }

    if (shouldClose) {
      this.close();
    }
  }

  close() {
    this._viewCtrl.close();
  }

  getValue() {
    let inputs = this.d.inputs;
    if (inputs) {
      if (inputs.length > 1) {
        // array of values for each input
        return inputs.map(i => i.input);

      } else if (inputs.length === 1) {
        // single value of the one input
        return inputs[0].input;
      }
    }
    // there are no inputs
    return null;
  }

  onPageDidLeave() {
    this.d.onClose && this.d.onClose(this.getValue());
  }
}


/**
 * Animations for alerts
 */
class AlertPopIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.3');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-pop-in', AlertPopIn);


class AlertPopOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.3', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-pop-out', AlertPopOut);


class AlertMdPopIn extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = enteringView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '0.01', '1').fromTo('scale', '1.1', '1');
    backdrop.fromTo('opacity', '0.01', '0.5');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-md-pop-in', AlertMdPopIn);


class AlertMdPopOut extends Animation {
  constructor(enteringView, leavingView, opts) {
    super(null, opts);

    let ele = leavingView.pageRef().nativeElement;
    let backdrop = new Animation(ele.querySelector('.backdrop'));
    let wrapper = new Animation(ele.querySelector('.alert-wrapper'));

    wrapper.fromTo('opacity', '1', '0').fromTo('scale', '1', '0.9');
    backdrop.fromTo('opacity', '0.5', '0');

    this
      .easing('ease-in-out')
      .duration(200)
      .add(backdrop, wrapper);
  }
}
Animation.register('alert-md-pop-out', AlertMdPopOut);
