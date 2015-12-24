import {Component, ElementRef, Renderer} from 'angular2/core';
import {NgClass, NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import {NavController, NavParams} from '../nav/nav-controller';
import {ViewController} from '../nav/view-controller';
import {Animation} from '../../animations/animation';
import {Button} from '../button/button';
import {extend, isDefined} from '../../util/util';


export class Alert extends ViewController {

  constructor(opts={}) {
    super(AlertCmp, opts);

    this.data.inputs = this.data.inputs || [];
    this.data.buttons = this.data.buttons || [];
  }

  getTransitionName(direction) {
    let key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
    return this._nav.config.get(key);
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
    this.data.inputs.push(input);
  }

  addButton(button) {
    this.data.buttons.push(button);
  }

  onDismiss(handler) {
    this.data.onDismiss = handler;
  }

  dismiss() {
    this._nav.dismiss(this);
  }

  static create(opts={}) {
    return new Alert(opts);
  }

}


@Component({
  selector: 'ion-alert',
  template:
    '<div (click)="dismiss()" tappable disable-activated class="backdrop" role="presentation"></div>' +
    '<div class="alert-wrapper">' +
      '<div class="alert-head">' +
        '<h2 class="alert-title" *ngIf="d.title">{{d.title}}</h2>' +
        '<h3 class="alert-sub-title" *ngIf="d.subTitle">{{d.subTitle}}</h3>' +
      '</div>' +
      '<div class="alert-body" *ngIf="d.body">{{d.body}}</div>' +
      '<div class="alert-body alert-inputs" *ngIf="d.inputs.length">' +
        '<div class="alert-input-wrapper" *ngFor="#i of d.inputs">' +
          '<div class="alert-input-label" *ngIf="i.label">{{i.label}}</div>' +
          '<input [placeholder]="i.placeholder" [(ngModel)]="i.value" [type]="i.type" class="alert-input">' +
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
    private _elementRef: ElementRef,
    params: NavParams,
    renderer: Renderer
  ) {
    this.d = params.data;
    if (this.d.cssClass) {
      renderer.setElementClass(_elementRef, this.d.cssClass, true);
    }
  }

  click(button) {
    let shouldDismiss = true;

    if (button.handler) {
      // a handler has been provided, run it
      if (button.handler(this.getValues()) === false) {
        // if the return value is a false then do not close
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

  getValues() {
    let values = {};
    this.d.inputs.forEach(input => {
      values[input.name] = input.value;
    });
    return values;
  }

  onPageWillEnter() {
    // normalize the data
    this.d.buttons = this.d.buttons.map(button => {
      if (typeof button === 'string') {
        return { text: button };
      }
      return button;
    });

    this.d.inputs = this.d.inputs.map((input, index) => {
      return {
        name: input.name || index,
        label: input.label,
        placeholder: input.placeholder || '',
        type: input.type || 'text',
        value: isDefined(input.value) ? input.value : ''
      }
    });

    let self = this;
    self.keyUp = function(ev) {
      if (ev.keyCode === 13) {
        // enter
        console.debug('alert enter');
        let button = self.d.buttons[self.d.buttons.length - 1];
        self.click(button);

      } else if (ev.keyCode === 27) {
        console.debug('alert escape');
        self.dismiss();
      }
    };

    document.addEventListener('keyup', this.keyUp);
  }

  onPageDidEnter() {
    document.activeElement && document.activeElement.blur();
    if (this.d.inputs.length) {
      let firstInput = this._elementRef.nativeElement.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }

  onPageDidLeave() {
    this.d.onDismiss && this.d.onDismiss(this.getValues());
    document.removeEventListener('keyup', this.keyUp);
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
