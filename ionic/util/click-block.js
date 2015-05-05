
const CSS_CLICK_BLOCK = 'click-block-active';
let cbEle, fallbackTimerId, pendingShow;

function preventClick(ev) {
  ev.preventDefault();
  ev.stopPropagation();
}

function show(expire) {
  clearTimeout(fallbackTimerId);
  fallbackTimerId = setTimeout(hide, expire || 320);

  if (cbEle) {
    cbEle.classList.add(CSS_CLICK_BLOCK);

  } else {
    cbEle = document.createElement('div');
    cbEle.className = 'click-block ' + CSS_CLICK_BLOCK;
    document.body.appendChild(cbEle);
    cbEle.addEventListener('touchstart', preventClick);
    cbEle.addEventListener('mousedown', preventClick);
  }
}

function hide() {
  clearTimeout(fallbackTimerId);
  cbEle && cbEle.classList.remove(CSS_CLICK_BLOCK);
}


export let ClickBlock = function(shouldShow, expire) {

  (shouldShow ? show : hide)(expire);

};
