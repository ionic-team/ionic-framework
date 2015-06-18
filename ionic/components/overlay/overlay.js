import {IonicRoot} from '../app/app';
import {Animation} from '../../animations/animation';
import {ClickBlock} from '../../util/click-block';
import * as util from 'ionic/util';


export class Overlay {

  /* Instance Methods */
  open(animation) {
    animation = animation || this._opts.enterAnimation;
    let enterAnimation = Animation.create(this.domElement, animation);
    ClickBlock(true, enterAnimation.duration() + 200);

    return new Promise(resolve => {
      enterAnimation.play().then(() => {
        ClickBlock(false);
        enterAnimation.dispose();
        resolve();
      });
    });
  }

  close(animation) {
    return new Promise(resolve => {
      animation = animation || this._opts.leaveAnimation;
      let leavingAnimation = Animation.create(this.domElement, animation);

      leavingAnimation.play().then(() => {
        this._clean();
        leavingAnimation.dispose();
        resolve();
      })
    });
  }

  setOptions(opts) {
    if (!this._opts) this._opts = {};
    util.extend(this._opts, opts);
  }

  _clean() {
    this._dispose && this._dispose();
  }


  /* Static Methods */
  static create(ComponentType: Type, opts) {
    return new Promise(resolve => {
      IonicRoot.append(ComponentType).then((ref) => {
        let overlay = ref.instance;
        overlay._dispose = ref.dispose;
        overlay.domElement = ref.elementRef.domElement;
        overlay.setOptions(opts);
        overlay.open();
        resolve(overlay);
      });
    });
  }

}
