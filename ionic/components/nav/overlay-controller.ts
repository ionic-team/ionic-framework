import {ViewController} from '../view-controller';
import {Config} from '../../config/config';
import {IonicApp} from '../app/app';


export class OverlayController extends ViewController {

  constructor(navCtrl, componentType, opts={}) {
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

}
