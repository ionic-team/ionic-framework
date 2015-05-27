import {Animation} from '../animations/animation';
import {Transition} from './transition';
import {rafPromise} from '../util/dom';


class NoneTransition extends Animation  {

  constructor(navCtrl) {
    super();
  }

  stage() {
    // immediately resolve
    return rafPromise();
  }

}

Transition.register('none', NoneTransition);
