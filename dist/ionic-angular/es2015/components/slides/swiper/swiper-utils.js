/**
 * @param {?} a
 * @return {?}
 */
export function round(a) {
    return Math.floor(a);
}
/**
 * @param {?} ele
 * @param {?} styles
 * @return {?}
 */
export function inlineStyle(ele, styles) {
    if (ele) {
        if (ele.length) {
            for (var /** @type {?} */ i = 0; i < ele.length; i++) {
                inlineStyle(ele[i], styles);
            }
        }
        else if (ele.nodeType) {
            var /** @type {?} */ cssProps = Object.keys(styles);
            for (let /** @type {?} */ i = 0; i < cssProps.length; i++) {
                ele.style[cssProps[i]] = styles[cssProps[i]];
            }
        }
    }
}
/**
 * @param {?} ele
 * @param {?} className
 * @return {?}
 */
export function addClass(ele, className) {
    if (ele) {
        if (ele.length) {
            for (var /** @type {?} */ i = 0; i < ele.length; i++) {
                addClass(ele[i], className);
            }
        }
        else if (ele.nodeType) {
            if (Array.isArray(className)) {
                className.forEach(cls => {
                    ele.classList.add(cls);
                });
            }
            else {
                ele.classList.add(className);
            }
        }
    }
}
/**
 * @param {?} ele
 * @param {?} className
 * @return {?}
 */
export function removeClass(ele, className) {
    if (ele) {
        if (ele.length) {
            for (var /** @type {?} */ i = 0; i < ele.length; i++) {
                removeClass(ele[i], className);
            }
        }
        else if (ele.nodeType) {
            if (Array.isArray(className)) {
                className.forEach(cls => {
                    ele.classList.remove(cls);
                });
            }
            else {
                ele.classList.remove(className);
            }
        }
    }
}
/**
 * @param {?} ele
 * @return {?}
 */
export function getElementIndex(ele) {
    var /** @type {?} */ i = 0;
    if (ele) {
        while ((ele = ele.previousSibling) !== null) {
            if (ele.nodeType === 1)
                i++;
        }
    }
    return i;
}
/**
 * @param {?} parentEle
 * @param {?} query
 * @return {?}
 */
export function queryChildren(parentEle, query) {
    if (parentEle) {
        return (parentEle.querySelectorAll(query));
    }
    return [];
}
/**
 * @param {?} parentEle
 * @param {?} query
 * @param {?} callback
 * @return {?}
 */
export function eachChild(parentEle, query, callback) {
    if (parentEle) {
        var /** @type {?} */ nodes = parentEle.querySelectorAll(query);
        for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
            callback(/** @type {?} */ (nodes[i]));
        }
    }
}
/**
 * @param {?} ele
 * @param {?} val
 * @return {?}
 */
export function transform(ele, val) {
    if (ele) {
        var /** @type {?} */ elStyle = (ele.style);
        elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.transform = val;
    }
}
/**
 * @param {?} ele
 * @param {?} duration
 * @return {?}
 */
export function transition(ele, duration) {
    if (ele) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        var /** @type {?} */ elStyle = (ele.style);
        elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.transitionDuration = duration;
    }
}
/**
 * @param {?} plt
 * @param {?} ele
 * @return {?}
 */
export function triggerTransitionEnd(plt, ele) {
    try {
        var /** @type {?} */ win = plt.win();
        var /** @type {?} */ evt = new win.CustomEvent('transitionend', { bubbles: true, cancelable: true });
        ele.dispatchEvent(evt);
    }
    catch (e) { }
}
/**
 * @param {?} ele
 * @param {?} plt
 * @return {?}
 */
export function offset(ele, plt) {
    if (ele) {
        var /** @type {?} */ box = plt.getElementBoundingClientRect(ele);
        var /** @type {?} */ body = plt.doc().body;
        var /** @type {?} */ win = plt.win();
        var /** @type {?} */ clientTop = ele.clientTop || body.clientTop || 0;
        var /** @type {?} */ clientLeft = ele.clientLeft || body.clientLeft || 0;
        var /** @type {?} */ scrollTop = win.pageYOffset || ele.scrollTop;
        var /** @type {?} */ scrollLeft = win.pageXOffset || ele.scrollLeft;
        return {
            top: box.top + scrollTop - clientTop,
            left: box.left + scrollLeft - clientLeft
        };
    }
    return null;
}
/**
 * @param {?} s
 * @return {?}
 */
export function updateSlidesOffset(s) {
    for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
        s._slides[i].swiperSlideOffset = isHorizontal(s) ? s._slides[i].offsetLeft : s._slides[i].offsetTop;
    }
}
/**
 * @param {?} s
 * @return {?}
 */
export function isHorizontal(s) {
    return s.direction === 'horizontal';
}
const /** @type {?} */ formElements = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'VIDEO'];
/**
 * @param {?} el
 * @return {?}
 */
export function isFormElement(el) {
    return !!el && formElements.indexOf(el.tagName) > -1;
}
/**
 * @param {?} s
 * @return {?}
 */
export function minTranslate(s) {
    return (-s._snapGrid[0]);
}
/**
 * @param {?} s
 * @return {?}
 */
export function maxTranslate(s) {
    return (-s._snapGrid[s._snapGrid.length - 1]);
}
export const /** @type {?} */ CLS = {
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
//# sourceMappingURL=swiper-utils.js.map