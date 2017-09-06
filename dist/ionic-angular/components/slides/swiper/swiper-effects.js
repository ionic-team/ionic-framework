import { CLS, eachChild, isHorizontal, transform, transition, triggerTransitionEnd } from './swiper-utils';
import { isIosUIWebView, isSafari } from '../../../platform/platform-utils';
/*=========================
  Effects
  ===========================*/
export var /** @type {?} */ SWIPER_EFFECTS = {
    'fade': {
        setTranslate: function (s) {
            for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                var /** @type {?} */ offset = slide.swiperSlideOffset;
                var /** @type {?} */ tx = -offset;
                if (!s.virtualTranslate) {
                    tx = tx - s._translate;
                }
                var /** @type {?} */ ty = 0;
                if (!isHorizontal(s)) {
                    ty = tx;
                    tx = 0;
                }
                var /** @type {?} */ slideOpacity = s.fade.crossFade ?
                    Math.max(1 - Math.abs(slide.progress), 0) :
                    1 + Math.min(Math.max(slide.progress, -1), 0);
                slide.style.opacity = (slideOpacity);
                transform(slide, 'translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
            }
        },
        setTransition: function (s, plt, duration) {
            var /** @type {?} */ slides = s._slides;
            for (var /** @type {?} */ i = 0; i < slides.length; i++) {
                transition(slides[i], duration);
            }
            if (s.virtualTranslate && duration !== 0) {
                var /** @type {?} */ eventTriggered = false;
                for (var /** @type {?} */ i_1 = 0; i_1 < slides.length; i_1++) {
                    plt.transitionEnd(slides[i_1], function () {
                        if (eventTriggered || !s)
                            return;
                        eventTriggered = true;
                        s._animating = false;
                        triggerTransitionEnd(plt, s._wrapper);
                    });
                }
            }
        }
    },
    'flip': {
        setTranslate: function (s, plt) {
            for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                var /** @type {?} */ progress = slide.progress;
                if (s.flip.limitRotation) {
                    progress = Math.max(Math.min(slide.progress, 1), -1);
                }
                var /** @type {?} */ offset = slide.swiperSlideOffset;
                var /** @type {?} */ rotate = -180 * progress, /** @type {?} */ rotateY = rotate, /** @type {?} */ rotateX = 0, /** @type {?} */ tx = -offset, /** @type {?} */ ty = 0;
                if (!isHorizontal(s)) {
                    ty = tx;
                    tx = 0;
                    rotateX = -rotateY;
                    rotateY = 0;
                }
                else if (s._rtl) {
                    rotateY = -rotateY;
                }
                slide.style.zIndex = (-Math.abs(Math.round(progress))) + s._slides.length;
                if (s.flip.slideShadows) {
                    // Set shadows
                    var /** @type {?} */ shadowBefore = ((isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-left') : slide.querySelector('.swiper-slide-shadow-top')));
                    var /** @type {?} */ shadowAfter = ((isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-right') : slide.querySelector('.swiper-slide-shadow-bottom')));
                    if (!shadowBefore) {
                        shadowBefore = plt.doc().createElement('div');
                        shadowBefore.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'left' : 'top');
                        slide.appendChild(shadowBefore);
                    }
                    if (!shadowAfter) {
                        shadowAfter = plt.doc().createElement('div');
                        shadowAfter.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'right' : 'bottom');
                        slide.appendChild(shadowAfter);
                    }
                    if (shadowBefore) {
                        shadowBefore.style.opacity = (Math.max(-progress, 0));
                    }
                    if (shadowAfter) {
                        shadowAfter.style.opacity = (Math.max(progress, 0));
                    }
                }
                transform(slide, 'translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
            }
        },
        setTransition: function (s, plt, duration) {
            for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                transition(slide, duration);
                eachChild(slide, '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left', function (el) {
                    transition(el, duration);
                });
            }
            if (s.virtualTranslate && duration !== 0) {
                var /** @type {?} */ eventTriggered = false;
                plt.transitionEnd(s._slides[s._activeIndex], function (ev) {
                    if (eventTriggered || !s)
                        return;
                    if (!((ev.target)).classList.contains(CLS.slideActive)) {
                        return;
                    }
                    eventTriggered = true;
                    s._animating = false;
                    triggerTransitionEnd(plt, s._wrapper);
                });
            }
        }
    },
    'cube': {
        setTranslate: function (s, plt) {
            var /** @type {?} */ wrapperRotate = 0;
            var /** @type {?} */ cubeShadow;
            if (s.cube.shadow) {
                if (isHorizontal(s)) {
                    cubeShadow = (s._wrapper.querySelector('.swiper-cube-shadow'));
                    if (!cubeShadow) {
                        cubeShadow = plt.doc().createElement('div');
                        cubeShadow.className = 'swiper-cube-shadow';
                        s._wrapper.appendChild(cubeShadow);
                    }
                    cubeShadow.style.height = s.renderedWidth + 'px';
                }
                else {
                    cubeShadow = (s.container.querySelector('.swiper-cube-shadow'));
                    if (!cubeShadow) {
                        cubeShadow = plt.doc().createElement('div');
                        cubeShadow.className = 'swiper-cube-shadow';
                        s._wrapper.appendChild(cubeShadow);
                    }
                }
            }
            for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                var /** @type {?} */ slideAngle = i * 90;
                var /** @type {?} */ round = Math.floor(slideAngle / 360);
                if (s._rtl) {
                    slideAngle = -slideAngle;
                    round = Math.floor(-slideAngle / 360);
                }
                var /** @type {?} */ progress = Math.max(Math.min(slide.progress, 1), -1);
                var /** @type {?} */ tx = 0, /** @type {?} */ ty = 0, /** @type {?} */ tz = 0;
                if (i % 4 === 0) {
                    tx = -round * 4 * s._renderedSize;
                    tz = 0;
                }
                else if ((i - 1) % 4 === 0) {
                    tx = 0;
                    tz = -round * 4 * s._renderedSize;
                }
                else if ((i - 2) % 4 === 0) {
                    tx = s._renderedSize + round * 4 * s._renderedSize;
                    tz = s._renderedSize;
                }
                else if ((i - 3) % 4 === 0) {
                    tx = -s._renderedSize;
                    tz = 3 * s._renderedSize + s._renderedSize * 4 * round;
                }
                if (s._rtl) {
                    tx = -tx;
                }
                if (!isHorizontal(s)) {
                    ty = tx;
                    tx = 0;
                }
                var /** @type {?} */ transformStr = 'rotateX(' + (isHorizontal(s) ? 0 : -slideAngle) + 'deg) rotateY(' + (isHorizontal(s) ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                if (progress <= 1 && progress > -1) {
                    wrapperRotate = i * 90 + progress * 90;
                    if (s._rtl)
                        wrapperRotate = -i * 90 - progress * 90;
                }
                transform(slide, transformStr);
                if (s.cube.slideShadows) {
                    // Set shadows
                    var /** @type {?} */ shadowBefore = ((isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-left') : slide.querySelector('.swiper-slide-shadow-top')));
                    var /** @type {?} */ shadowAfter = ((isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-right') : slide.querySelector('.swiper-slide-shadow-bottom')));
                    if (!shadowBefore) {
                        shadowBefore = plt.doc().createElement('div');
                        shadowBefore.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'left' : 'top');
                        slide.appendChild(shadowBefore);
                    }
                    if (!shadowAfter) {
                        shadowAfter = plt.doc().createElement('div');
                        shadowAfter.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'right' : 'bottom');
                        slide.appendChild(shadowAfter);
                    }
                    if (shadowBefore)
                        shadowBefore.style.opacity = (Math.max(-progress, 0));
                    if (shadowAfter)
                        shadowAfter.style.opacity = (Math.max(progress, 0));
                }
            }
            s._wrapper.style.transformOrigin = s._wrapper.style.webkitTransformOrigin = '50% 50% -' + (s._renderedSize / 2) + 'px';
            if (s.cube.shadow) {
                if (isHorizontal(s)) {
                    transform(cubeShadow, 'translate3d(0px, ' + (s.renderedWidth / 2 + s.cube.shadowOffset) + 'px, ' + (-s.renderedWidth / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.cube.shadowScale) + ')');
                }
                else {
                    var /** @type {?} */ shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                    var /** @type {?} */ multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                    var /** @type {?} */ scale1 = s.cube.shadowScale;
                    var /** @type {?} */ scale2 = s.cube.shadowScale / multiplier;
                    var /** @type {?} */ offset = s.cube.shadowOffset;
                    transform(cubeShadow, 'scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.renderedHeight / 2 + offset) + 'px, ' + (-s.renderedHeight / 2 / scale2) + 'px) rotateX(-90deg)');
                }
            }
            var /** @type {?} */ zFactor = (isSafari(plt) || isIosUIWebView(plt)) ? (-s._renderedSize / 2) : 0;
            transform(s._wrapper, 'translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isHorizontal(s) ? 0 : wrapperRotate) + 'deg) rotateY(' + (isHorizontal(s) ? -wrapperRotate : 0) + 'deg)');
        },
        setTransition: function (s, _plt, duration) {
            for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                transition(slide, duration);
                eachChild(slide, '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left', function (el) {
                    transition(el, duration);
                });
            }
            if (s.cube.shadow && !isHorizontal(s)) {
                eachChild(s.container, '.swiper-cube-shadow', function (el) {
                    transition(el, duration);
                });
            }
        }
    },
    'coverflow': {
        setTranslate: function (s, plt) {
            var /** @type {?} */ transformStr = s._translate;
            var /** @type {?} */ center = isHorizontal(s) ? -transformStr + s.renderedWidth / 2 : -transformStr + s.renderedHeight / 2;
            var /** @type {?} */ rotate = isHorizontal(s) ? s.coverflow.rotate : -s.coverflow.rotate;
            var /** @type {?} */ translate = s.coverflow.depth;
            // Each slide offset from center
            for (var /** @type {?} */ i = 0, /** @type {?} */ length = s._slides.length; i < length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                var /** @type {?} */ slideSize = s._slidesSizesGrid[i];
                var /** @type {?} */ slideOffset = slide.swiperSlideOffset;
                var /** @type {?} */ offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.coverflow.modifier;
                var /** @type {?} */ rotateY = isHorizontal(s) ? rotate * offsetMultiplier : 0;
                var /** @type {?} */ rotateX = isHorizontal(s) ? 0 : rotate * offsetMultiplier;
                // var rotateZ = 0
                var /** @type {?} */ translateZ = -translate * Math.abs(offsetMultiplier);
                var /** @type {?} */ translateY = isHorizontal(s) ? 0 : s.coverflow.stretch * (offsetMultiplier);
                var /** @type {?} */ translateX = isHorizontal(s) ? s.coverflow.stretch * (offsetMultiplier) : 0;
                // Fix for ultra small values
                if (Math.abs(translateX) < 0.001)
                    translateX = 0;
                if (Math.abs(translateY) < 0.001)
                    translateY = 0;
                if (Math.abs(translateZ) < 0.001)
                    translateZ = 0;
                if (Math.abs(rotateY) < 0.001)
                    rotateY = 0;
                if (Math.abs(rotateX) < 0.001)
                    rotateX = 0;
                var /** @type {?} */ slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
                transform(slide, slideTransform);
                slide.style.zIndex = (-Math.abs(Math.round(offsetMultiplier))) + 1;
                if (s.coverflow.slideShadows) {
                    // Set shadows
                    var /** @type {?} */ shadowBefore = ((isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-left') : slide.querySelector('.swiper-slide-shadow-top')));
                    var /** @type {?} */ shadowAfter = ((isHorizontal(s) ? slide.querySelector('.swiper-slide-shadow-right') : slide.querySelector('.swiper-slide-shadow-bottom')));
                    if (!shadowBefore) {
                        shadowBefore = plt.doc().createElement('div');
                        shadowBefore.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'left' : 'top');
                        slide.appendChild(shadowBefore);
                    }
                    if (!shadowAfter) {
                        shadowAfter = plt.doc().createElement('div');
                        shadowAfter.className = 'swiper-slide-shadow-' + (isHorizontal(s) ? 'right' : 'bottom');
                        slide.appendChild(shadowAfter);
                    }
                    if (shadowBefore) {
                        shadowBefore.style.opacity = ((offsetMultiplier > 0 ? offsetMultiplier : 0));
                    }
                    if (shadowAfter) {
                        shadowAfter.style.opacity = (((-offsetMultiplier) > 0 ? -offsetMultiplier : 0));
                    }
                }
            }
        },
        setTransition: function (s, _plt, duration) {
            for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
                var /** @type {?} */ slide = s._slides[i];
                transition(slide, duration);
                eachChild(slide, '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left', function (el) {
                    transition(el, duration);
                });
            }
        }
    }
};
//# sourceMappingURL=swiper-effects.js.map