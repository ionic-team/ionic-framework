import {nativeTimeout} from './dom';


const CSS_CLICK_BLOCK = 'click-block-active';
const DEFAULT_EXPIRE = 330;
let cbEle: HTMLElement;
let fallbackTimerId: number;
let isShowing = false;

/**
 * @private
 */
export class ClickBlock {
  private _enabled: boolean = false;

  enable() {
    cbEle = document.createElement('click-block');
    document.body.appendChild(cbEle);
    cbEle.addEventListener('touchmove', function(ev: UIEvent) {
      ev.preventDefault();
      ev.stopPropagation();
    });
    this._enabled = true;
  }

  show(shouldShow: boolean, expire: number) {
    if (this._enabled) {
      if (shouldShow) {
        show(expire);

      } else {
        hide();
      }
    }
  }

}

function show(expire: number) {
  clearTimeout(fallbackTimerId);
  fallbackTimerId = nativeTimeout(hide, expire || DEFAULT_EXPIRE);

  if (!isShowing) {
    cbEle.classList.add(CSS_CLICK_BLOCK);
      isShowing = true;
  }
}

function hide() {
  clearTimeout(fallbackTimerId);
  if (isShowing) {
    cbEle.classList.remove(CSS_CLICK_BLOCK);
    isShowing = false;
  }
}
