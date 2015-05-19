import {Transition} from './transition'


const SHOW_TOOLBAR_CSS = 'show-toolbar';
const SHOW_NAV_ITEM_CSS = 'show-nav-item';


class NoneTransition {

  constructor(navCtrl) {
    // get the entering and leaving items
    let enteringItem = navCtrl.getStagedEnteringItem();
    let leavingItem = navCtrl.getStagedLeavingItem();

    // show entering contet
    let enteringContent = enteringItem.getContent();
    enteringContent.classList.add(SHOW_NAV_ITEM_CSS);

    // show entering headers
    let enteringToolbars = enteringItem.getToolbars();
    for (let i = 0; i < enteringToolbars.length; i++) {
      enteringToolbars[i].classList.add(SHOW_TOOLBAR_CSS);
    }

    // hide the leaving item
    if (leavingItem) {
      let leavingContent = leavingItem.getContent();
      if (leavingContent) {
        leavingContent.classList.remove(SHOW_NAV_ITEM_CSS);
      }

      let leavingToolbars = leavingItem.getToolbars();
      for (let i = 0; i < leavingToolbars.length; i++) {
        leavingToolbars[i].classList.remove(SHOW_TOOLBAR_CSS);
      }
    }
  }

  stage() {
    // immediately resolve
    return Promise.resolve();
  }

  play() {
    // immediately resolve
    return Promise.resolve();
  }

}

Transition.register('none', NoneTransition);
