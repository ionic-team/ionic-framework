/*==================================================
    Prototype
====================================================*/
Swiper.prototype = {
    isSafari: (function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
    })(),
    isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent),
    isArray: function (arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    },
    /*==================================================
    Browser
    ====================================================*/
    browser: {
        ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
        ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1),
        lteIE9: (function() {
            // create temporary DIV
            var div = document.createElement('div');
            // add content to tmp DIV which is wrapped into the IE HTML conditional statement
            div.innerHTML = '<!--[if lte IE 9]><i></i><![endif]-->';
            // return true / false value based on what will browser render
            return div.getElementsByTagName('i').length === 1;
        })()
    },
    /*==================================================
    Devices
    ====================================================*/
    device: (function () {
        var ua = window.navigator.userAgent;
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
        var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
        var iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
        return {
            ios: ipad || iphone || ipod,
            android: android
        };
    })(),
    /*==================================================
    Feature Detection
    ====================================================*/
    support: {
        touch : (window.Modernizr && Modernizr.touch === true) || (function () {
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })(),

        transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
            var div = document.createElement('div').style;
            return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
        })(),

        flexbox: (function () {
            var div = document.createElement('div').style;
            var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
            for (var i = 0; i < styles.length; i++) {
                if (styles[i] in div) return true;
            }
        })(),

        observer: (function () {
            return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
        })(),

        passiveListener: (function () {
            var supportsPassive = false;
            try {
                var opts = Object.defineProperty({}, 'passive', {
                    get: function() {
                        supportsPassive = true;
                    }
                });
                window.addEventListener('testPassiveListener', null, opts);
            } catch (e) {}
            return supportsPassive;
        })(),

        gestures: (function () {
            return 'ongesturestart' in window;
        })()
    },
    /*==================================================
    Plugins
    ====================================================*/
    plugins: {}
};
