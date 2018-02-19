/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

function clamp(min, n, max) {
    return Math.max(min, Math.min(n, max));
}
function isDef(v) { return v !== undefined && v !== null; }

function isArray(v) { return Array.isArray(v); }
function isObject(v) { return v !== null && typeof v === 'object'; }

function isString(v) { return typeof v === 'string'; }
function isNumber(v) { return typeof v === 'number'; }


function isBlank(val) { return val === undefined || val === null; }
/** @hidden */

function assert(bool, msg) {
    if (!bool) {
        console.error(msg);
    }
}

function now(ev) {
    return ev.timeStamp || Date.now();
}
function pointerCoordX(ev) {
    // get X coordinates for either a mouse click
    // or a touch depending on the given event
    if (ev) {
        const changedTouches = ev.changedTouches;
        if (changedTouches && changedTouches.length > 0) {
            return changedTouches[0].clientX;
        }
        if (ev.pageX !== undefined) {
            return ev.pageX;
        }
    }
    return 0;
}
function updateDetail(ev, detail) {
    // get X coordinates for either a mouse click
    // or a touch depending on the given event
    let x = 0;
    let y = 0;
    if (ev) {
        const changedTouches = ev.changedTouches;
        if (changedTouches && changedTouches.length > 0) {
            const touch = changedTouches[0];
            x = touch.clientX;
            y = touch.clientY;
        }
        else if (ev.pageX !== undefined) {
            x = ev.pageX;
            y = ev.pageY;
        }
    }
    detail.currentX = x;
    detail.currentY = y;
}
function pointerCoordY(ev) {
    // get Y coordinates for either a mouse click
    // or a touch depending on the given event
    if (ev) {
        const changedTouches = ev.changedTouches;
        if (changedTouches && changedTouches.length > 0) {
            return changedTouches[0].clientY;
        }
        if (ev.pageY !== undefined) {
            return ev.pageY;
        }
    }
    return 0;
}
function getElementReference(el, ref) {
    if (ref === 'child') {
        return el.firstElementChild;
    }
    if (ref === 'parent') {
        return getParentElement(el) || el;
    }
    if (ref === 'body') {
        return el.ownerDocument.body;
    }
    if (ref === 'document') {
        return el.ownerDocument;
    }
    if (ref === 'window') {
        return el.ownerDocument.defaultView;
    }
    return el;
}
function getParentElement(el) {
    if (el.parentElement) {
        // normal element with a parent element
        return el.parentElement;
    }
    if (el.parentNode && el.parentNode.host) {
        // shadow dom's document fragment
        return el.parentNode.host;
    }
    return null;
}
function getPageElement(el) {
    const tabs = el.closest('ion-tabs');
    if (tabs) {
        return tabs;
    }
    const page = el.closest('ion-page,.ion-page,page-inner');
    if (page) {
        return page;
    }
    return getParentElement(el);
}
function applyStyles(el, styles) {
    const styleProps = Object.keys(styles);
    if (el) {
        for (let i = 0; i < styleProps.length; i++) {
            el.style[styleProps[i]] = styles[styleProps[i]];
        }
    }
}
function checkEdgeSide(posX, isRightSide, maxEdgeStart) {
    if (isRightSide) {
        return posX >= window.innerWidth - maxEdgeStart;
    }
    else {
        return posX <= maxEdgeStart;
    }
}
/**
 * @hidden
 * Given a side, return if it should be on the right
 * based on the value of dir
 * @param side the side
 * @param isRTL whether the application dir is rtl
 * @param defaultRight whether the default side is right
 */
function isRightSide(side, defaultRight = false) {
    const isRTL = document.dir === 'rtl';
    switch (side) {
        case 'right': return true;
        case 'left': return false;
        case 'end': return !isRTL;
        case 'start': return isRTL;
        default: return defaultRight ? !isRTL : isRTL;
    }
}
/** @hidden */
function swipeShouldReset(isResetDirection, isMovingFast, isOnResetZone) {
    // The logic required to know when the sliding item should close (openAmount=0)
    // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
    // and it ended up being too complicated to be written manually without errors
    // so the truth table is attached below: (0=false, 1=true)
    // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
    //         0        |       0      |       0       ||    0
    //         0        |       0      |       1       ||    1
    //         0        |       1      |       0       ||    0
    //         0        |       1      |       1       ||    0
    //         1        |       0      |       0       ||    0
    //         1        |       0      |       1       ||    1
    //         1        |       1      |       0       ||    1
    //         1        |       1      |       1       ||    1
    // The resulting expression was generated by resolving the K-map (Karnaugh map):
    return (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
}
function getOrAppendElement(tagName) {
    const element = document.querySelector(tagName);
    if (element) {
        return element;
    }
    const tmp = document.createElement(tagName);
    document.body.appendChild(tmp);
    return tmp;
}
function getWindow() {
    return window;
}
function getDocument() {
    return document;
}
function getActiveElement() {
    return getDocument()['activeElement'];
}
function focusOutActiveElement() {
    const activeElement = getActiveElement();
    activeElement && activeElement.blur && activeElement.blur();
}
function isTextInput(el) {
    return !!el &&
        (el.tagName === 'TEXTAREA'
            || el.contentEditable === 'true'
            || (el.tagName === 'INPUT' && !(NON_TEXT_INPUT_REGEX.test(el.type))));
}
const NON_TEXT_INPUT_REGEX = /^(radio|checkbox|range|file|submit|reset|color|image|button)$/i;
function hasFocusedTextInput() {
    const activeElement = getActiveElement();
    if (isTextInput(activeElement) && activeElement.parentElement) {
        return activeElement.parentElement.querySelector(':focus') === activeElement;
    }
    return false;
}
/**
 * @private
 */

function playAnimationAsync(animation) {
    return new Promise((resolve) => {
        animation.onFinish((ani) => {
            resolve(ani);
        });
        animation.play();
    });
}
function domControllerAsync(domControllerFunction, callback) {
    return new Promise((resolve) => {
        domControllerFunction(() => {
            if (!callback) {
                return resolve();
            }
            Promise.resolve(callback()).then((...args) => {
                resolve(args);
            });
        });
    });
}
function debounce(func, wait = 0) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(func, wait, ...args);
    };
}
function asyncRaf() {
    return new Promise(resolve => requestAnimationFrame(resolve));
}
function getNavAsChildIfExists(element) {
    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].tagName.toLowerCase() === 'ion-nav') {
            return element.children[i];
        }
    }
    return null;
}
function normalizeUrl(url) {
    url = url.trim();
    if (url.charAt(0) !== '/') {
        // ensure first char is a /
        url = '/' + url;
    }
    if (url.length > 1 && url.charAt(url.length - 1) === '/') {
        // ensure last char is not a /
        url = url.substr(0, url.length - 1);
    }
    return url;
}
function isParentTab(element) {
    return element.parentElement.tagName.toLowerCase() === 'ion-tab';
}
function getIonApp() {
    const appElement = document.querySelector('ion-app');
    if (!appElement) {
        return Promise.resolve(null);
    }
    return appElement.componentOnReady();
}

export { domControllerAsync, isDef, playAnimationAsync, isString, getOrAppendElement, now, pointerCoordX, pointerCoordY, debounce, getPageElement, isArray, isBlank, clamp, isObject, applyStyles, assert, getElementReference, updateDetail, isRightSide, swipeShouldReset, focusOutActiveElement, getDocument, getWindow, hasFocusedTextInput, checkEdgeSide, normalizeUrl, isNumber, isParentTab, asyncRaf, getIonApp, getNavAsChildIfExists };
