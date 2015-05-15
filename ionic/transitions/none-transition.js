import {Transition} from './transition'


class NoneTransition {

  constructor(navCtrl) {
    // get the entering and leaving items
    let enteringItem = navCtrl.getStagedEnteringItem();
    let leavingItem = navCtrl.getStagedLeavingItem();

    // show entering contet
    let enteringContent = enteringItem.getContent();
    enteringContent.classList.add('show-nav-item');
    enteringContent.style.transform = 'translateX(0%)';

    // show entering headers
    let enteringToolbars = enteringItem.getToolbars();
    for (let i = 0; i < enteringToolbars.length; i++) {
      enteringToolbars[i].classList.add('show-toolbar');
      enteringToolbars[i].style.transform = 'translateX(0%)';
    }

    // hide the leaving item
    if (leavingItem) {
      let leavingContent = leavingItem.getContent();
      if (leavingContent) {
        leavingContent.classList.remove('show-nav-item');
      }

      let leavingToolbars = leavingItem.getToolbars();
      for (let i = 0; i < leavingToolbars.length; i++) {
        leavingToolbars[i].classList.remove('show-toolbar');
      }
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
