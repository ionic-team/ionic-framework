
const CSS_CLICK_BLOCK = 'click-block-active';
const DEFAULT_EXPIRE = 330;
let cbEle, fallbackTimerId;
let isShowing = false;


function preventClick(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

function show(expire) {
  clearTimeout(fallbackTimerId);
  fallbackTimerId = setTimeout(hide, expire || DEFAULT_EXPIRE);

  if (!isShowing) {
    isShowing = true;
    if (cbEle) {
      cbEle.classList.add(CSS_CLICK_BLOCK);

    } else {
      cbEle = document.createElement('div');
      cbEle.className = 'click-block ' + CSS_CLICK_BLOCK;
      document.body.appendChild(cbEle);
      cbEle.addEventListener('touchstart', preventClick);
      cbEle.addEventListener('mousedown', preventClick);
      cbEle.addEventListener('pointerdown', preventClick);
      cbEle.addEventListener('MSPointerDown', preventClick);
    }
  }
}

function hide() {
  clearTimeout(fallbackTimerId);
  if (isShowing) {
    cbEle.classList.remove(CSS_CLICK_BLOCK);
    isShowing = false;
  }
}

export let ClickBlock = function(shouldShow, expire) {
  (shouldShow ? show : hide)(expire);
};
