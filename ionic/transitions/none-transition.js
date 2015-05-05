import {Transition} from './transition'


class NoneTransition {

  constructor(navCtrl, opts) {

    // get the entering and leaving items
    let enteringItem = navCtrl.getStagedEnteringItem();
    let leavingItem = navCtrl.getStagedLeavingItem();

    // show the entering item
    enteringItem.navItem.domElement.style.display = 'block';
    enteringItem.navItem.domElement.style.transform = 'translateX(0%)';

    // hide the leaving item
    if (leavingItem && leavingItem.navItem) {
      leavingItem.navItem.domElement.style.display = '';
    }
  }

  stage() {
    // immediately resolve
    return Promise.resolve();
  }

  start() {
    // immediately resolve
    return Promise.resolve();
  }

}

Transition.register('none', NoneTransition);
