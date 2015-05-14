import {Transition} from './transition'


class NoneTransition {

  constructor(navCtrl) {
    // get the entering and leaving items
    let enteringItem = navCtrl.getStagedEnteringItem();
    let leavingItem = navCtrl.getStagedLeavingItem();

    // show entering contet
    let enteringContent = enteringItem.getContent();
    enteringContent.style.display = 'block';
    enteringContent.style.transform = 'translateX(0%)';

    // show entering headers
    let toolbarElements = enteringItem.getToolbars();
    for (let i = 0; i < toolbarElements.length; i++) {
      toolbarElements[i].style.display = 'block';
      toolbarElements[i].style.transform = 'translateX(0%)';
    }

    // hide the leaving item
    if (leavingItem) {
      let leavingContent = leavingItem.getContent();
      if (leavingContent) {
        leavingContent.style.display = '';
      }

      let leavingHeaderElements = leavingItem.getToolbars();
      for (let i = 0; i < leavingHeaderElements.length; i++) {
        leavingHeaderElements[i].style.display = '';
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
