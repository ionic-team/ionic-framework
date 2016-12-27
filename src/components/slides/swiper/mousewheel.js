/*=========================
  Mousewheel Control
  ===========================*/
s.mousewheel = {
    event: false,
    lastScrollTime: (new window.Date()).getTime()
};
if (s.params.mousewheelControl) {
    /**
     * The best combination if you prefer spinX + spinY normalization.  It favors
     * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
     * 'wheel' event, making spin speed determination impossible.
     */
    s.mousewheel.event = (navigator.userAgent.indexOf('firefox') > -1) ?
        'DOMMouseScroll' :
        isEventSupported() ?
            'wheel' : 'mousewheel';
}

function isEventSupported() {
    var eventName = 'onwheel';
    var isSupported = eventName in document;

    if (!isSupported) {
        var element = document.createElement('div');
        element.setAttribute(eventName, 'return;');
        isSupported = typeof element[eventName] === 'function';
    }

    if (!isSupported &&
        document.implementation &&
        document.implementation.hasFeature &&
            // always returns true in newer browsers as per the standard.
            // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
        document.implementation.hasFeature('', '') !== true ) {
        // This is the only way to test support for the `wheel` event in IE9+.
        isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
    }

    return isSupported;
}

function handleMousewheel(e) {
    if (e.originalEvent) e = e.originalEvent; //jquery fix
    var delta = 0;
    var rtlFactor = s.rtl ? -1 : 1;

    var data = normalizeWheel( e );

    if (s.params.mousewheelForceToAxis) {
        if (s.isHorizontal()) {
            if (Math.abs(data.pixelX) > Math.abs(data.pixelY)) delta = data.pixelX * rtlFactor;
            else return;
        }
        else {
            if (Math.abs(data.pixelY) > Math.abs(data.pixelX)) delta = data.pixelY;
            else return;
        }
    }
    else {
        delta = Math.abs(data.pixelX) > Math.abs(data.pixelY) ? - data.pixelX * rtlFactor : - data.pixelY;
    }

    if (delta === 0) return;

    if (s.params.mousewheelInvert) delta = -delta;

    if (!s.params.freeMode) {
        if ((new window.Date()).getTime() - s.mousewheel.lastScrollTime > 60) {
            if (delta < 0) {
                if ((!s.isEnd || s.params.loop) && !s.animating) {
                    s.slideNext();
                    s.emit('onScroll', s, e);
                }
                else if (s.params.mousewheelReleaseOnEdges) return true;
            }
            else {
                if ((!s.isBeginning || s.params.loop) && !s.animating) {
                    s.slidePrev();
                    s.emit('onScroll', s, e);
                }
                else if (s.params.mousewheelReleaseOnEdges) return true;
            }
        }
        s.mousewheel.lastScrollTime = (new window.Date()).getTime();

    }
    else {
        //Freemode or scrollContainer:
        var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity;
        var wasBeginning = s.isBeginning,
            wasEnd = s.isEnd;

        if (position >= s.minTranslate()) position = s.minTranslate();
        if (position <= s.maxTranslate()) position = s.maxTranslate();

        s.setWrapperTransition(0);
        s.setWrapperTranslate(position);
        s.updateProgress();
        s.updateActiveIndex();

        if (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) {
            s.updateClasses();
        }

        if (s.params.freeModeSticky) {
            clearTimeout(s.mousewheel.timeout);
            s.mousewheel.timeout = setTimeout(function () {
                s.slideReset();
            }, 300);
        }
        else {
            if (s.params.lazyLoading && s.lazy) {
                s.lazy.load();
            }
        }
        // Emit event
        s.emit('onScroll', s, e);

        // Stop autoplay
        if (s.params.autoplay && s.params.autoplayDisableOnInteraction) s.stopAutoplay();

        // Return page scroll on edge positions
        if (position === 0 || position === s.maxTranslate()) return;
    }

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
    return false;
}
s.disableMousewheelControl = function () {
    if (!s.mousewheel.event) return false;
    var target = s.container;
    if (s.params.mousewheelEventsTarged !== 'container') {
        target = $(s.params.mousewheelEventsTarged);
    }
    target.off(s.mousewheel.event, handleMousewheel);
    return true;
};

s.enableMousewheelControl = function () {
    if (!s.mousewheel.event) return false;
    var target = s.container;
    if (s.params.mousewheelEventsTarged !== 'container') {
        target = $(s.params.mousewheelEventsTarged);
    }
    target.on(s.mousewheel.event, handleMousewheel);
    return true;
};

/**
 * Mouse wheel (and 2-finger trackpad) support on the web sucks.  It is
 * complicated, thus this doc is long and (hopefully) detailed enough to answer
 * your questions.
 *
 * If you need to react to the mouse wheel in a predictable way, this code is
 * like your bestest friend. * hugs *
 *
 * As of today, there are 4 DOM event types you can listen to:
 *
 *   'wheel'                -- Chrome(31+), FF(17+), IE(9+)
 *   'mousewheel'           -- Chrome, IE(6+), Opera, Safari
 *   'MozMousePixelScroll'  -- FF(3.5 only!) (2010-2013) -- don't bother!
 *   'DOMMouseScroll'       -- FF(0.9.7+) since 2003
 *
 * So what to do?  The is the best:
 *
 *   normalizeWheel.getEventType();
 *
 * In your event callback, use this code to get sane interpretation of the
 * deltas.  This code will return an object with properties:
 *
 *   spinX   -- normalized spin speed (use for zoom) - x plane
 *   spinY   -- " - y plane
 *   pixelX  -- normalized distance (to pixels) - x plane
 *   pixelY  -- " - y plane
 *
 * Wheel values are provided by the browser assuming you are using the wheel to
 * scroll a web page by a number of lines or pixels (or pages).  Values can vary
 * significantly on different platforms and browsers, forgetting that you can
 * scroll at different speeds.  Some devices (like trackpads) emit more events
 * at smaller increments with fine granularity, and some emit massive jumps with
 * linear speed or acceleration.
 *
 * This code does its best to normalize the deltas for you:
 *
 *   - spin is trying to normalize how far the wheel was spun (or trackpad
 *     dragged).  This is super useful for zoom support where you want to
 *     throw away the chunky scroll steps on the PC and make those equal to
 *     the slow and smooth tiny steps on the Mac. Key data: This code tries to
 *     resolve a single slow step on a wheel to 1.
 *
 *   - pixel is normalizing the desired scroll delta in pixel units.  You'll
 *     get the crazy differences between browsers, but at least it'll be in
 *     pixels!
 *
 *   - positive value indicates scrolling DOWN/RIGHT, negative UP/LEFT.  This
 *     should translate to positive value zooming IN, negative zooming OUT.
 *     This matches the newer 'wheel' event.
 *
 * Why are there spinX, spinY (or pixels)?
 *
 *   - spinX is a 2-finger side drag on the trackpad, and a shift + wheel turn
 *     with a mouse.  It results in side-scrolling in the browser by default.
 *
 *   - spinY is what you expect -- it's the classic axis of a mouse wheel.
 *
 *   - I dropped spinZ/pixelZ.  It is supported by the DOM 3 'wheel' event and
 *     probably is by browsers in conjunction with fancy 3D controllers .. but
 *     you know.
 *
 * Implementation info:
 *
 * Examples of 'wheel' event if you scroll slowly (down) by one step with an
 * average mouse:
 *
 *   OS X + Chrome  (mouse)     -    4   pixel delta  (wheelDelta -120)
 *   OS X + Safari  (mouse)     -  N/A   pixel delta  (wheelDelta  -12)
 *   OS X + Firefox (mouse)     -    0.1 line  delta  (wheelDelta  N/A)
 *   Win8 + Chrome  (mouse)     -  100   pixel delta  (wheelDelta -120)
 *   Win8 + Firefox (mouse)     -    3   line  delta  (wheelDelta -120)
 *
 * On the trackpad:
 *
 *   OS X + Chrome  (trackpad)  -    2   pixel delta  (wheelDelta   -6)
 *   OS X + Firefox (trackpad)  -    1   pixel delta  (wheelDelta  N/A)
 *
 * On other/older browsers.. it's more complicated as there can be multiple and
 * also missing delta values.
 *
 * The 'wheel' event is more standard:
 *
 * http://www.w3.org/TR/DOM-Level-3-Events/#events-wheelevents
 *
 * The basics is that it includes a unit, deltaMode (pixels, lines, pages), and
 * deltaX, deltaY and deltaZ.  Some browsers provide other values to maintain
 * backward compatibility with older events.  Those other values help us
 * better normalize spin speed.  Example of what the browsers provide:
 *
 *                          | event.wheelDelta | event.detail
 *        ------------------+------------------+--------------
 *          Safari v5/OS X  |       -120       |       0
 *          Safari v5/Win7  |       -120       |       0
 *         Chrome v17/OS X  |       -120       |       0
 *         Chrome v17/Win7  |       -120       |       0
 *                IE9/Win7  |       -120       |   undefined
 *         Firefox v4/OS X  |     undefined    |       1
 *         Firefox v4/Win7  |     undefined    |       3
 *
 */
function normalizeWheel( /*object*/ event ) /*object*/ {
    // Reasonable defaults
    var PIXEL_STEP = 10;
    var LINE_HEIGHT = 40;
    var PAGE_HEIGHT = 800;

    var sX = 0, sY = 0,       // spinX, spinY
        pX = 0, pY = 0;       // pixelX, pixelY

    // Legacy
    if( 'detail' in event ) {
        sY = event.detail;
    }
    if( 'wheelDelta' in event ) {
        sY = -event.wheelDelta / 120;
    }
    if( 'wheelDeltaY' in event ) {
        sY = -event.wheelDeltaY / 120;
    }
    if( 'wheelDeltaX' in event ) {
        sX = -event.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if( 'axis' in event && event.axis === event.HORIZONTAL_AXIS ) {
        sX = sY;
        sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if( 'deltaY' in event ) {
        pY = event.deltaY;
    }
    if( 'deltaX' in event ) {
        pX = event.deltaX;
    }

    if( (pX || pY) && event.deltaMode ) {
        if( event.deltaMode === 1 ) {          // delta in LINE units
            pX *= LINE_HEIGHT;
            pY *= LINE_HEIGHT;
        } else {                             // delta in PAGE units
            pX *= PAGE_HEIGHT;
            pY *= PAGE_HEIGHT;
        }
    }

    // Fall-back if spin cannot be determined
    if( pX && !sX ) {
        sX = (pX < 1) ? -1 : 1;
    }
    if( pY && !sY ) {
        sY = (pY < 1) ? -1 : 1;
    }

    return {
        spinX: sX,
        spinY: sY,
        pixelX: pX,
        pixelY: pY
    };
}