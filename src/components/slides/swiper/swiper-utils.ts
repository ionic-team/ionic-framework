import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';


export function round(a: any) {
  return Math.floor(a);
}

export function inlineStyle(ele: any, styles: any) {
  if (ele) {
    if (ele.length) {
      for (var i = 0; i < ele.length; i++) {
        inlineStyle(ele[i], styles);
      }

    } else if (ele.nodeType) {
      var cssProps = Object.keys(styles);
      for (let i = 0; i < cssProps.length; i++) {
        ele.style[cssProps[i]] = styles[cssProps[i]];
      }
    }
  }
}

export function addClass(ele: any, className: string) {
  if (ele) {
    if (ele.length) {
      for (var i = 0; i < ele.length; i++) {
        addClass(ele[i], className);
      }

    } else if (ele.nodeType) {
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

export function removeClass(ele: any, className: any) {
  if (ele) {
    if (ele.length) {
      for (var i = 0; i < ele.length; i++) {
        removeClass(ele[i], className);
      }

    } else if (ele.nodeType) {
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

export function eachChild(parentEle: HTMLElement, query: string, callback: {(foundEle: HTMLElement): void}): void {
  if (parentEle) {
    var nodes = parentEle.querySelectorAll(query);
    for (var i = 0; i < nodes.length; i++) {
      callback(<any>nodes[i]);
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

export function offset(ele: HTMLElement, plt: Platform) {
  if (ele) {
    var box = plt.getElementBoundingClientRect(ele);
    var body = plt.doc().body;
    var win = plt.win();
    var clientTop  = ele.clientTop  || body.clientTop  || 0;
    var clientLeft = ele.clientLeft || body.clientLeft || 0;
    var scrollTop  = win.pageYOffset || ele.scrollTop;
    var scrollLeft = win.pageXOffset || ele.scrollLeft;
    return {
      top: box.top  + scrollTop  - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  return null;
}

export function updateSlidesOffset(s: Slides) {
  for (var i = 0; i < s._slides.length; i++) {
    s._slides[i].swiperSlideOffset = isHorizontal(s) ? s._slides[i].offsetLeft : s._slides[i].offsetTop;
  }
}

export function isHorizontal(s: Slides) {
  return s.direction === 'horizontal';
}

const formElements = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'VIDEO'];
export function isFormElement(el: any) {
  return !!el && formElements.indexOf(el.tagName) > -1;
}


/*=========================
  Min/Max Translate
  ===========================*/
export function minTranslate(s: Slides) {
  return (-s._snapGrid[0]);
}

export function maxTranslate(s: Slides) {
  return (-s._snapGrid[s._snapGrid.length - 1]);
}

export const CLS = {
  // Classnames
  noSwiping: 'swiper-no-swiping',
  containerModifier: 'swiper-container-',
  slide: 'swiper-slide',
  slideActive: 'swiper-slide-active',
  slideDuplicateActive: 'swiper-slide-duplicate-active',
  slideVisible: 'swiper-slide-visible',
  slideDuplicate: 'swiper-slide-duplicate',
  slideNext: 'swiper-slide-next',
  slideDuplicateNext: 'swiper-slide-duplicate-next',
  slidePrev: 'swiper-slide-prev',
  slideDuplicatePrev: 'swiper-slide-duplicate-prev',
  wrapper: 'swiper-wrapper',
  bullet: 'swiper-pagination-bullet',
  bulletActive: 'swiper-pagination-bullet-active',
  buttonDisabled: 'swiper-button-disabled',
  paginationCurrent: 'swiper-pagination-current',
  paginationTotal: 'swiper-pagination-total',
  paginationHidden: 'swiper-pagination-hidden',
  paginationProgressbar: 'swiper-pagination-progressbar',
  paginationClickable: 'swiper-pagination-clickable',
  paginationModifier: 'swiper-pagination-',
  lazyLoading: 'swiper-lazy',
  lazyStatusLoading: 'swiper-lazy-loading',
  lazyStatusLoaded: 'swiper-lazy-loaded',
  lazyPreloader: 'swiper-lazy-preloader',
  notification: 'swiper-notification',
  preloader: 'preloader',
  zoomContainer: 'swiper-zoom-container',
};
