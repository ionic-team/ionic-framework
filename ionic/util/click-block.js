import {raf} from './dom'


const CSS_CLICK_BLOCK = 'click-block-active';
const DEFAULT_EXPIRE = 330;
let cbEle, fallbackTimerId, pendingShow;

function preventClick(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

function show(expire) {
  pendingShow = true;
  clearTimeout(fallbackTimerId);
  fallbackTimerId = setTimeout(hide, expire || DEFAULT_EXPIRE);
  raf(addBlock);
}

function hide() {
  pendingShow = false;
  clearTimeout(fallbackTimerId);
  raf(removeBlock);
}

function addBlock() {
  if (pendingShow) {

    if (cbEle) {
      cbEle.classList.add(CSS_CLICK_BLOCK);

    } else {
      cbEle = document.createElement('div');
      cbEle.className = 'click-block ' + CSS_CLICK_BLOCK;
      document.body.appendChild(cbEle);
      cbEle.addEventListener('touchstart', preventClick);
      cbEle.addEventListener('mousedown', preventClick);
    }
    pendingShow = false;
  }
}

function removeBlock() {
  if (!pendingShow) {
    cbEle && cbEle.classList.remove(CSS_CLICK_BLOCK);
  }
}

export let ClickBlock = function(shouldShow, expire) {

  (shouldShow ? show : hide)(expire);

};
