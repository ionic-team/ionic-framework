import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';


export function round(a) {
  return Math.floor(a);
}


export function inlineStyle(ele: HTMLElement|HTMLElement[], styles: any) {
  if (Array.isArray(ele)) {
    ele.forEach(el => {
      inlineStyle(el, styles);
    });

  } else {
    var cssProps = Object.keys(styles);
    for (var i = 0; i < cssProps.length; i++) {
      ele.style[cssProps[i]] = styles[cssProps[i]];
    }
  }
}

export function addClass(ele: HTMLElement|HTMLElement[], className: string) {
  if (ele) {
    if (Array.isArray(ele)) {
      ele.forEach(el => {
        addClass(el, className);
      });

    } else {
      if (Array.isArray(className)) {
        className.forEach(cls => {
          ele.classList.add(cls);
        });
      } else {
        ele.classList.add(className);
      }
    }
  }
}

export function removeClass(ele: HTMLElement|HTMLElement[], className: any) {
  if (ele) {
    if (Array.isArray(ele)) {
      ele.forEach(el => {
        removeClass(el, className);
      });

    } else {
      if (Array.isArray(className)) {
        className.forEach(cls => {
          ele.classList.remove(cls);
        });
      } else {
        ele.classList.remove(className);
      }
    }
  }
}


export function getElementIndex(ele: any) {
  var i = 0;
  if (ele) {
    while ((ele = ele.previousSibling) !== null) {
      if (ele.nodeType === 1) i++;
    }
  }
  return i;
}


export function queryChildren(parentEle: HTMLElement, query: string): HTMLElement[] {
  if (parentEle) {
    return <any>parentEle.querySelectorAll(query);
  }
  return [];
}


export function eachChild(parentEle: HTMLElement, query: string, callback: {(foundEle: HTMLElement)}): void {
  if (parentEle) {
    var ele = <any>parentEle.querySelectorAll(query);
    if (ele) {
      callback(ele);
    }
  }
}


export function transform(ele: HTMLElement, val: any) {
  if (ele) {
    var elStyle = <any>ele.style;
    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.transform = val;
  }
}


export function transition(ele: HTMLElement, duration: any) {
  if (ele) {
    if (typeof duration !== 'string') {
      duration = duration + 'ms';
    }
    var elStyle = <any>ele.style;
    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.transitionDuration = duration;
  }
}


export function triggerTransitionEnd(plt: Platform, ele: HTMLElement) {
  try {
    var win: any = plt.win();
    var evt = new win.CustomEvent('transitionend', {bubbles: true, cancelable: true});
    ele.dispatchEvent(evt);
  } catch (e) {}
}


export function offset(el: HTMLElement, plt: Platform) {
  if (el) {
    var box = plt.getElementBoundingClientRect(el);
    var body = plt.doc().body;
    var win = plt.win();
    var clientTop  = el.clientTop  || body.clientTop  || 0;
    var clientLeft = el.clientLeft || body.clientLeft || 0;
    var scrollTop  = win.pageYOffset || el.scrollTop;
    var scrollLeft = win.pageXOffset || el.scrollLeft;
    return {
      top: box.top  + scrollTop  - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  return null;
}


export function updateSlidesOffset(s: Slides) {
  for (var i = 0; i < s.slides.length; i++) {
    s.slides[i].swiperSlideOffset = isHorizontal(s) ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
  }
}


export function isHorizontal(s: Slides) {
  return s.params.direction === 'horizontal';
}

const formElements = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'VIDEO'];
export function isFormElement(el: any) {
  return !!el && formElements.indexOf(el.tagName) > -1;
}


/*=========================
  Min/Max Translate
  ===========================*/
export function minTranslate(s: Slides) {
  return (-s.snapGrid[0]);
}

export function maxTranslate(s: Slides) {
  return (-s.snapGrid[s.snapGrid.length - 1]);
}
