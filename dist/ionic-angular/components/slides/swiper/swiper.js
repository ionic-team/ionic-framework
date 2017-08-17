/**
 * Adopted from Swiper
 * Most modern mobile touch slider and framework with hardware
 * accelerated transitions.
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 */
import { CLS, addClass, eachChild, inlineStyle, isHorizontal, maxTranslate, minTranslate, removeClass, round, updateSlidesOffset } from './swiper-utils';
import { setWrapperTransition, setWrapperTranslate } from './swiper-transition';
import { updateProgress } from './swiper-progress';
import { updateClasses } from './swiper-classes';
import { parallaxSetTranslate } from './swiper-parallax';
import { updateActiveIndex, updateRealIndex } from './swiper-index';
import { SWIPER_EFFECTS } from './swiper-effects';
import { updatePagination } from './swiper-pagination';
import { resetZoomEvents } from './swiper-zoom';
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function initSwiper(s, plt) {
    // Classname
    s._classNames = [];
    /*=========================
      Preparation - Define Container, Wrapper and Pagination
      ===========================*/
    if (!s.container) {
        return;
    }
    // Save instance in container HTML Element and in data
    s.container.swiper = s;
    var /** @type {?} */ containerModifierClass = CLS.containerModifier;
    s._classNames.push(containerModifierClass + s.direction);
    if (s.freeMode) {
        s._classNames.push(containerModifierClass + 'free-mode');
    }
    if (s.autoHeight) {
        s._classNames.push(containerModifierClass + 'autoheight');
    }
    // Enable slides progress when required
    if (s.parallax || s.watchSlidesVisibility) {
        s.watchSlidesProgress = true;
    }
    // Max resistance when touchReleaseOnEdges
    if (s.touchReleaseOnEdges) {
        s.resistanceRatio = 0;
    }
    var /** @type {?} */ effect = s.effect;
    // Coverflow / 3D
    if (['cube', 'coverflow', 'flip'].indexOf(effect) >= 0) {
        s.watchSlidesProgress = true;
        s._classNames.push(containerModifierClass + '3d');
    }
    if (effect !== 'slide') {
        s._classNames.push(containerModifierClass + effect);
    }
    if (effect === 'cube') {
        s.resistanceRatio = 0;
        s.slidesPerView = 1;
        s.slidesPerColumn = 1;
        s.slidesPerGroup = 1;
        s.centeredSlides = false;
        s.spaceBetween = 0;
        s.virtualTranslate = true;
        s.setWrapperSize = false;
    }
    if (effect === 'fade' || effect === 'flip') {
        s.slidesPerView = 1;
        s.slidesPerColumn = 1;
        s.slidesPerGroup = 1;
        s.watchSlidesProgress = true;
        s.spaceBetween = 0;
        s.setWrapperSize = false;
        s.virtualTranslate = true;
    }
    // Wrapper
    s._wrapper = (s.container.querySelector('.' + CLS.wrapper));
    // Pagination
    if (s.paginationType) {
        s._paginationContainer = (s.container.querySelector('.swiper-pagination'));
        if (s.paginationType === 'bullets') {
            s._paginationContainer.classList.add(CLS.paginationModifier + 'clickable');
        }
        s._paginationContainer.classList.add(CLS.paginationModifier + s.paginationType);
    }
    // Next/Prev Buttons
    // if (s.nextButton || s.prevButton) {
    //   if (s.nextButton) {
    //     s.nextButton = <any>s.container.closest('ion-content').querySelector(s.nextButton);
    //   }
    //   if (s.prevButton) {
    //     s.prevButton = <any>s.container.closest('ion-content').querySelector(s.prevButton);
    //   }
    // }
    // RTL
    s._rtl = isHorizontal(s) && (s.container.dir.toLowerCase() === 'rtl' || s.container.style.direction === 'rtl');
    if (s._rtl) {
        s._classNames.push(containerModifierClass + 'rtl');
    }
    // Columns
    if (s.slidesPerColumn > 1) {
        s._classNames.push(containerModifierClass + 'multirow');
    }
    // Check for Android
    if (plt.is('android')) {
        s._classNames.push(containerModifierClass + 'android');
    }
    // Add classes
    s._classNames.forEach(function (clsName) {
        s.container.classList.add(clsName);
    });
    // Translate
    s._translate = 0;
    // Progress
    s.progress = 0;
    // Velocity
    s.velocity = 0;
    /*=========================
      Autoplay
      ===========================*/
    s._autoplayTimeoutId = undefined;
    s._autoplaying = false;
    s._autoplayPaused = false;
    s._allowClick = true;
    // Animating Flag
    s._animating = false;
    // Touches information
    s._touches = {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
    };
    if (s.loop) {
        createLoop(s);
    }
    updateContainerSize(s, plt);
    updateSlidesSize(s, plt);
    updatePagination(s);
    if (effect !== 'slide' && SWIPER_EFFECTS[effect]) {
        if (!s.loop) {
            updateProgress(s);
        }
        SWIPER_EFFECTS[effect].setTranslate(s, plt);
    }
    if (s.loop) {
        slideTo(s, plt, s.initialSlide + s.loopedSlides, 0, s.runCallbacksOnInit);
    }
    else {
        slideTo(s, plt, s.initialSlide, 0, s.runCallbacksOnInit);
        if (s.initialSlide === 0) {
            parallaxSetTranslate(s);
        }
    }
    if (s.autoplay) {
        startAutoplay(s, plt);
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
function autoplay(s, plt) {
    var /** @type {?} */ autoplayDelay = s.autoplay;
    var /** @type {?} */ activeSlide = s._slides[s._activeIndex];
    if (activeSlide.hasAttribute('data-swiper-autoplay')) {
        autoplayDelay = ((activeSlide.getAttribute('data-swiper-autoplay') || s.autoplay));
    }
    s._autoplayTimeoutId = plt.timeout(function () {
        s._zone.run(function () {
            if (s.loop) {
                fixLoop(s, plt);
                slideNext(s, plt, true, undefined, true);
                s.ionSlideAutoplay.emit(s);
            }
            else {
                if (!s._isEnd) {
                    slideNext(s, plt, true, undefined, true);
                    s.ionSlideAutoplay.emit(s);
                }
                else {
                    if (!s.autoplayStopOnLast) {
                        slideTo(s, plt, 0);
                        s.ionSlideAutoplay.emit(s);
                    }
                    else {
                        stopAutoplay(s);
                    }
                }
            }
        });
    }, autoplayDelay);
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function startAutoplay(s, plt) {
    if (typeof s._autoplayTimeoutId !== 'undefined')
        return false;
    if (!s.autoplay || s._autoplaying) {
        return false;
    }
    s._autoplaying = true;
    s._zone.run(function () {
        s.ionSlideAutoplayStart.emit(s);
    });
    autoplay(s, plt);
}
/**
 * @param {?} s
 * @return {?}
 */
export function stopAutoplay(s) {
    if (!s._autoplayTimeoutId)
        return;
    if (s._autoplayTimeoutId)
        clearTimeout(s._autoplayTimeoutId);
    s._autoplaying = false;
    s._autoplayTimeoutId = undefined;
    s._zone.run(function () {
        s.ionSlideAutoplayStop.emit(s);
    });
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} speed
 * @return {?}
 */
export function pauseAutoplay(s, plt, speed) {
    if (s._autoplayPaused)
        return;
    if (s._autoplayTimeoutId)
        clearTimeout(s._autoplayTimeoutId);
    s._autoplayPaused = true;
    if (speed === 0) {
        s._autoplayPaused = false;
        autoplay(s, plt);
    }
    else {
        plt.transitionEnd(s._wrapper, function () {
            if (!s)
                return;
            s._autoplayPaused = false;
            if (!s._autoplaying) {
                stopAutoplay(s);
            }
            else {
                autoplay(s, plt);
            }
        });
    }
}
/**
 * @param {?} s
 * @return {?}
 */
export function updateAutoHeight(s) {
    var /** @type {?} */ activeSlides = [];
    var /** @type {?} */ newHeight = 0;
    var /** @type {?} */ i;
    // Find slides currently in view
    if (s.slidesPerView !== 'auto' && s.slidesPerView > 1) {
        for (i = 0; i < Math.ceil(/** @type {?} */ (s.slidesPerView)); i++) {
            var /** @type {?} */ index = s._activeIndex + i;
            if (index > s._slides.length)
                break;
            activeSlides.push(s._slides[index]);
        }
    }
    else {
        activeSlides.push(s._slides[s._activeIndex]);
    }
    // Find new height from heighest slide in view
    for (i = 0; i < activeSlides.length; i++) {
        if (typeof activeSlides[i] !== 'undefined') {
            var /** @type {?} */ height = activeSlides[i].offsetHeight;
            newHeight = height > newHeight ? height : newHeight;
        }
    }
    // Update Height
    if (newHeight) {
        s._wrapper.style.height = newHeight + 'px';
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function updateContainerSize(s, plt) {
    var /** @type {?} */ container = s.container;
    var /** @type {?} */ width;
    var /** @type {?} */ height;
    if (typeof s.width !== 'undefined') {
        // manually assign user width
        width = s.width;
    }
    else {
        width = container.clientWidth;
    }
    if (typeof s.renderedHeight !== 'undefined') {
        // manually assign user height
        height = s.renderedHeight;
    }
    else {
        height = container.clientHeight;
    }
    if (width === 0 && isHorizontal(s) || height === 0 && !isHorizontal(s)) {
        return;
    }
    // Subtract paddings
    var /** @type {?} */ containerStyles = plt.getElementComputedStyle(container);
    width = width - parseInt(containerStyles.paddingLeft, 10) - parseInt(containerStyles.paddingRight, 10);
    height = height - parseInt(containerStyles.paddingTop, 10) - parseInt(containerStyles.paddingBottom, 10);
    // Store values
    s.renderedWidth = width;
    s.renderedHeight = height;
    s._renderedSize = isHorizontal(s) ? width : height;
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function updateSlidesSize(s, plt) {
    s._slides = ((s._wrapper.querySelectorAll('.' + CLS.slide)));
    s._snapGrid = [];
    s._slidesGrid = [];
    s._slidesSizesGrid = [];
    var /** @type {?} */ spaceBetween = s.spaceBetween;
    var /** @type {?} */ slidePosition = -s.slidesOffsetBefore;
    var /** @type {?} */ i;
    var /** @type {?} */ prevSlideSize = 0;
    var /** @type {?} */ index = 0;
    if (typeof s._renderedSize === 'undefined')
        return;
    if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
        spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s._renderedSize;
    }
    s._virtualSize = -spaceBetween;
    // reset margins
    if (s._rtl) {
        inlineStyle(s._slides, { marginLeft: '', marginTop: '' });
    }
    else {
        inlineStyle(s._slides, { marginRight: '', marginBottom: '' });
    }
    var /** @type {?} */ slidesNumberEvenToRows;
    if (s.slidesPerColumn > 1) {
        if (Math.floor(s._slides.length / s.slidesPerColumn) === s._slides.length / s.slidesPerColumn) {
            slidesNumberEvenToRows = s._slides.length;
        }
        else {
            slidesNumberEvenToRows = Math.ceil(s._slides.length / s.slidesPerColumn) * s.slidesPerColumn;
        }
        if (s.slidesPerView !== 'auto' && s.slidesPerColumnFill === 'row') {
            slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, /** @type {?} */ (s.slidesPerView) * s.slidesPerColumn);
        }
    }
    // Calc slides
    var /** @type {?} */ slideSize;
    var /** @type {?} */ slidesPerColumn = s.slidesPerColumn;
    var /** @type {?} */ slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
    var /** @type {?} */ numFullColumns = slidesPerRow - (s.slidesPerColumn * slidesPerRow - s._slides.length);
    for (i = 0; i < s._slides.length; i++) {
        slideSize = 0;
        var /** @type {?} */ slide = s._slides[i];
        if (s.slidesPerColumn > 1) {
            // Set slides order
            var /** @type {?} */ newSlideOrderIndex;
            var /** @type {?} */ column;
            var /** @type {?} */ row;
            if (s.slidesPerColumnFill === 'column') {
                column = Math.floor(i / slidesPerColumn);
                row = i - column * slidesPerColumn;
                if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn - 1)) {
                    if (++row >= slidesPerColumn) {
                        row = 0;
                        column++;
                    }
                }
                newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                inlineStyle(slide, {
                    '-webkit-box-ordinal-group': newSlideOrderIndex,
                    '-moz-box-ordinal-group': newSlideOrderIndex,
                    '-ms-flex-order': newSlideOrderIndex,
                    '-webkit-order': newSlideOrderIndex,
                    'order': newSlideOrderIndex
                });
            }
            else {
                row = Math.floor(i / slidesPerRow);
                column = i - row * slidesPerRow;
            }
            var /** @type {?} */ cssVal = (row !== 0 && s.spaceBetween) && (s.spaceBetween + 'px');
            var /** @type {?} */ cssObj = {};
            if (isHorizontal(s)) {
                cssObj['marginTop'] = cssVal;
            }
            else {
                cssObj['marginLeft'] = cssVal;
            }
            inlineStyle(slide, cssObj);
            slide.setAttribute('data-swiper-column', /** @type {?} */ (column));
            slide.setAttribute('data-swiper-row', /** @type {?} */ (row));
        }
        if (slide.style.display === 'none') {
            continue;
        }
        if (s.slidesPerView === 'auto') {
            var /** @type {?} */ styles = plt.getElementComputedStyle(slide);
            if (isHorizontal(s)) {
                slideSize = slide.offsetWidth + parseFloat(styles.marginRight) + parseFloat(styles.marginLeft);
            }
            else {
                slideSize = slide.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
            }
            if (s.roundLengths)
                slideSize = round(slideSize);
        }
        else {
            slideSize = (s._renderedSize - ((s.slidesPerView) - 1) * spaceBetween) / (s.slidesPerView);
            if (s.roundLengths)
                slideSize = round(slideSize);
            if (isHorizontal(s)) {
                s._slides[i].style.width = slideSize + 'px';
            }
            else {
                s._slides[i].style.height = slideSize + 'px';
            }
        }
        s._slides[i].swiperSlideSize = slideSize;
        s._slidesSizesGrid.push(slideSize);
        if (s.centeredSlides) {
            slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
            if (i === 0)
                slidePosition = slidePosition - s._renderedSize / 2 - spaceBetween;
            if (Math.abs(slidePosition) < 1 / 1000)
                slidePosition = 0;
            if ((index) % s.slidesPerGroup === 0)
                s._snapGrid.push(slidePosition);
            s._slidesGrid.push(slidePosition);
        }
        else {
            if ((index) % s.slidesPerGroup === 0)
                s._snapGrid.push(slidePosition);
            s._slidesGrid.push(slidePosition);
            slidePosition = slidePosition + slideSize + spaceBetween;
        }
        s._virtualSize += slideSize + spaceBetween;
        prevSlideSize = slideSize;
        index++;
    }
    s._virtualSize = Math.max(s._virtualSize, s._renderedSize) + s.slidesOffsetAfter;
    var /** @type {?} */ newSlidesGrid;
    if (s._rtl && (s.effect === 'slide' || s.effect === 'coverflow')) {
        inlineStyle(s._wrapper, { width: s._virtualSize + s.spaceBetween + 'px' });
    }
    if (s.setWrapperSize) {
        if (isHorizontal(s)) {
            inlineStyle(s._wrapper, { width: s._virtualSize + s.spaceBetween + 'px' });
        }
        else {
            inlineStyle(s._wrapper, { height: s._virtualSize + s.spaceBetween + 'px' });
        }
    }
    if (s.slidesPerColumn > 1) {
        s._virtualSize = (slideSize + s.spaceBetween) * slidesNumberEvenToRows;
        s._virtualSize = Math.ceil(s._virtualSize / s.slidesPerColumn) - s.spaceBetween;
        if (isHorizontal(s)) {
            inlineStyle(s._wrapper, { width: s._virtualSize + s.spaceBetween + 'px' });
        }
        else {
            inlineStyle(s._wrapper, { height: s._virtualSize + s.spaceBetween + 'px' });
        }
        if (s.centeredSlides) {
            newSlidesGrid = [];
            for (i = 0; i < s._snapGrid.length; i++) {
                if (s._snapGrid[i] < s._virtualSize + s._snapGrid[0])
                    newSlidesGrid.push(s._snapGrid[i]);
            }
            s._snapGrid = newSlidesGrid;
        }
    }
    // Remove last grid elements depending on width
    if (!s.centeredSlides) {
        newSlidesGrid = [];
        for (i = 0; i < s._snapGrid.length; i++) {
            if (s._snapGrid[i] <= s._virtualSize - s._renderedSize) {
                newSlidesGrid.push(s._snapGrid[i]);
            }
        }
        s._snapGrid = newSlidesGrid;
        if (Math.floor(s._virtualSize - s._renderedSize) - Math.floor(s._snapGrid[s._snapGrid.length - 1]) > 1) {
            s._snapGrid.push(s._virtualSize - s._renderedSize);
        }
    }
    if (s._snapGrid.length === 0)
        s._snapGrid = [0];
    if (s.spaceBetween !== 0) {
        if (isHorizontal(s)) {
            if (s._rtl) {
                inlineStyle(s._slides, { marginLeft: spaceBetween + 'px' });
            }
            else {
                inlineStyle(s._slides, { marginRight: spaceBetween + 'px' });
            }
        }
        else {
            inlineStyle(s._slides, { marginBottom: spaceBetween + 'px' });
        }
    }
    if (s.watchSlidesProgress) {
        updateSlidesOffset(s);
    }
}
/**
 * @param {?} s
 * @return {?}
 */
export function currentSlidesPerView(s) {
    var /** @type {?} */ spv = 1;
    var /** @type {?} */ i;
    var /** @type {?} */ j;
    if (s.centeredSlides) {
        var /** @type {?} */ size = s._slides[s._activeIndex].swiperSlideSize;
        var /** @type {?} */ breakLoop;
        for (i = s._activeIndex + 1; i < s._slides.length; i++) {
            if (s._slides[i] && !breakLoop) {
                size += s._slides[i].swiperSlideSize;
                spv++;
                if (size > s._renderedSize)
                    breakLoop = true;
            }
        }
        for (j = s._activeIndex - 1; j >= 0; j--) {
            if (s._slides[j] && !breakLoop) {
                size += s._slides[j].swiperSlideSize;
                spv++;
                if (size > s._renderedSize)
                    breakLoop = true;
            }
        }
    }
    else {
        for (i = s._activeIndex + 1; i < s._slides.length; i++) {
            if (s._slidesGrid[i] - s._slidesGrid[s._activeIndex] < s._renderedSize) {
                spv++;
            }
        }
    }
    return spv;
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} updateTranslate
 * @return {?}
 */
export function update(s, plt, updateTranslate) {
    if (!s)
        return;
    updateContainerSize(s, plt);
    updateSlidesSize(s, plt);
    updateProgress(s);
    updatePagination(s);
    updateClasses(s);
    if (s.zoom) {
        resetZoomEvents(s, plt);
    }
    var /** @type {?} */ translated;
    var /** @type {?} */ newTranslate;
    /**
     * @return {?}
     */
    function forceSetTranslate() {
        newTranslate = Math.min(Math.max(s._translate, maxTranslate(s)), minTranslate(s));
        setWrapperTranslate(s, plt, newTranslate);
        updateActiveIndex(s);
        updateClasses(s);
    }
    if (updateTranslate) {
        if (s._spline) {
            s._spline = undefined;
        }
        if (s.freeMode) {
            forceSetTranslate();
            if (s.autoHeight) {
                updateAutoHeight(s);
            }
        }
        else {
            if ((s.slidesPerView === 'auto' || s.slidesPerView > 1) && s._isEnd && !s.centeredSlides) {
                translated = slideTo(s, plt, s._slides.length - 1, 0, false, true);
            }
            else {
                translated = slideTo(s, plt, s._activeIndex, 0, false, true);
            }
            if (!translated) {
                forceSetTranslate();
            }
        }
    }
    else if (s.autoHeight) {
        updateAutoHeight(s);
    }
}
/**
 * @param {?} s
 * @return {?}
 */
function createLoop(s) {
    // Remove duplicated slides
    eachChild(s._wrapper, '.' + CLS.slide + '.' + CLS.slideDuplicate, function (ele) {
        ele.parentElement.removeChild(ele);
    });
    var /** @type {?} */ slides = (s._wrapper.querySelectorAll('.' + CLS.slide));
    if (s.slidesPerView === 'auto' && !s.loopedSlides) {
        s.loopedSlides = slides.length;
    }
    s.loopedSlides = parseInt(/** @type {?} */ ((s.loopedSlides || s.slidesPerView)), 10);
    s.loopedSlides = s.loopedSlides + s.loopAdditionalSlides;
    if (s.loopedSlides > slides.length) {
        s.loopedSlides = slides.length;
    }
    var /** @type {?} */ prependSlides = [];
    var /** @type {?} */ appendSlides = [];
    for (var /** @type {?} */ i = 0; i < slides.length; i++) {
        var /** @type {?} */ slide = slides[i];
        if (i < s.loopedSlides)
            appendSlides.push(slide);
        if (i < slides.length && i >= slides.length - s.loopedSlides)
            prependSlides.push(slide);
        slide.setAttribute('data-swiper-slide-index', /** @type {?} */ (i));
    }
    for (i = 0; i < appendSlides.length; i++) {
        var /** @type {?} */ appendClone = appendSlides[i].cloneNode(true);
        addClass(appendClone, CLS.slideDuplicate);
        s._wrapper.appendChild(appendClone);
    }
    for (i = prependSlides.length - 1; i >= 0; i--) {
        var /** @type {?} */ prependClone = prependSlides[i].cloneNode(true);
        addClass(prependClone, CLS.slideDuplicate);
        s._wrapper.insertBefore(prependClone, s._wrapper.firstElementChild);
    }
}
/**
 * @param {?} s
 * @return {?}
 */
function destroyLoop(s) {
    eachChild(s._wrapper, '.' + CLS.slide + '.' + CLS.slideDuplicate, function (ele) {
        ele.parentElement.removeChild(ele);
    });
    for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
        s._slides[i].removeAttribute('data-swiper-slide-index');
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @return {?}
 */
export function fixLoop(s, plt) {
    var /** @type {?} */ newIndex;
    if (s._activeIndex < s.loopedSlides) {
        // Fix For Negative Oversliding
        newIndex = s._slides.length - s.loopedSlides * 3 + s._activeIndex;
        newIndex = newIndex + s.loopedSlides;
        slideTo(s, plt, newIndex, 0, false, true);
    }
    else if ((s.slidesPerView === 'auto' && s._activeIndex >= s.loopedSlides * 2) || (s._activeIndex > s._slides.length - (s.slidesPerView) * 2)) {
        // Fix For Positive Oversliding
        newIndex = -s._slides.length + s._activeIndex + s.loopedSlides;
        newIndex = newIndex + s.loopedSlides;
        slideTo(s, plt, newIndex, 0, false, true);
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} slideIndex
 * @param {?=} speed
 * @param {?=} runCallbacks
 * @param {?=} internal
 * @return {?}
 */
export function slideTo(s, plt, slideIndex, speed, runCallbacks, internal) {
    if (runCallbacks === void 0) { runCallbacks = true; }
    if (typeof slideIndex === 'undefined')
        slideIndex = 0;
    if (slideIndex < 0)
        slideIndex = 0;
    s._snapIndex = Math.floor(slideIndex / s.slidesPerGroup);
    if (s._snapIndex >= s._snapGrid.length)
        s._snapIndex = s._snapGrid.length - 1;
    var /** @type {?} */ translate = -s._snapGrid[s._snapIndex];
    // Stop autoplay
    if (s.autoplay && s._autoplaying) {
        if (internal || !s.autoplayDisableOnInteraction) {
            pauseAutoplay(s, plt, speed);
        }
        else {
            stopAutoplay(s);
        }
    }
    // Update progress
    updateProgress(s, translate);
    // Directions locks
    if (!s._allowSwipeToNext && translate < s._translate && translate < minTranslate(s)) {
        return false;
    }
    if (!s._allowSwipeToPrev && translate > s._translate && translate > maxTranslate(s)) {
        if ((s._activeIndex || 0) !== slideIndex)
            return false;
    }
    // Update Index
    if (typeof speed === 'undefined')
        speed = s.speed;
    s._previousIndex = s._activeIndex || 0;
    s._activeIndex = slideIndex;
    updateRealIndex(s);
    if ((s._rtl && -translate === s._translate) || (!s._rtl && translate === s._translate)) {
        // Update Height
        if (s.autoHeight) {
            updateAutoHeight(s);
        }
        updateClasses(s);
        if (s.effect !== 'slide') {
            setWrapperTranslate(s, plt, translate);
        }
        return false;
    }
    updateClasses(s);
    onTransitionStart(s, runCallbacks);
    if (speed === 0) {
        setWrapperTranslate(s, plt, translate);
        setWrapperTransition(s, plt, 0);
        onTransitionEnd(s, plt, runCallbacks);
    }
    else {
        setWrapperTranslate(s, plt, translate);
        setWrapperTransition(s, plt, speed);
        if (!s._animating) {
            s._animating = true;
            plt.transitionEnd(s._wrapper, function () {
                if (!s)
                    return;
                onTransitionEnd(s, plt, runCallbacks);
            });
        }
    }
    return true;
}
/**
 * @param {?} s
 * @param {?=} runCallbacks
 * @return {?}
 */
export function onTransitionStart(s, runCallbacks) {
    if (runCallbacks === void 0) { runCallbacks = true; }
    if (s.autoHeight) {
        updateAutoHeight(s);
    }
    if (runCallbacks) {
        s._zone.run(function () {
            s.ionSlideTransitionStart.emit(s);
            if (s._activeIndex !== s._previousIndex) {
                s.ionSlideWillChange.emit(s);
                if (s._activeIndex > s._previousIndex) {
                    s.ionSlideNextStart.emit(s);
                }
                else {
                    s.ionSlidePrevStart.emit(s);
                }
            }
        });
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} runCallbacks
 * @return {?}
 */
export function onTransitionEnd(s, plt, runCallbacks) {
    if (runCallbacks === void 0) { runCallbacks = true; }
    s._animating = false;
    setWrapperTransition(s, plt, 0);
    if (runCallbacks) {
        s._zone.run(function () {
            s.ionSlideTransitionEnd.emit(s);
            if (s._activeIndex !== s._previousIndex) {
                s.ionSlideDidChange.emit(s);
                if (s._activeIndex > s._previousIndex) {
                    s.ionSlideNextEnd.emit(s);
                }
                else {
                    s.ionSlidePrevEnd.emit(s);
                }
            }
        });
    }
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} runCallbacks
 * @param {?=} speed
 * @param {?=} internal
 * @return {?}
 */
export function slideNext(s, plt, runCallbacks, speed, internal) {
    if (s.loop) {
        if (s._animating)
            return false;
        fixLoop(s, plt);
        s.container.clientLeft;
        return slideTo(s, plt, s._activeIndex + s.slidesPerGroup, speed, runCallbacks, internal);
    }
    var /** @type {?} */ nextSlide = s._activeIndex + s.slidesPerGroup;
    if (nextSlide < s._slides.length) {
        return slideTo(s, plt, nextSlide, speed, runCallbacks, internal);
    }
    return false;
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} runCallbacks
 * @param {?=} speed
 * @param {?=} internal
 * @return {?}
 */
export function slidePrev(s, plt, runCallbacks, speed, internal) {
    if (s.loop) {
        if (s._animating)
            return false;
        fixLoop(s, plt);
        s.container.clientLeft;
        return slideTo(s, plt, s._activeIndex - 1, speed, runCallbacks, internal);
    }
    var /** @type {?} */ previousSlide = s._activeIndex - 1;
    if (previousSlide >= 0) {
        return slideTo(s, plt, s._activeIndex - 1, speed, runCallbacks, internal);
    }
    return false;
}
/**
 * @param {?} s
 * @param {?} plt
 * @param {?=} runCallbacks
 * @param {?=} speed
 * @return {?}
 */
export function slideReset(s, plt, runCallbacks, speed) {
    return slideTo(s, plt, s._activeIndex, speed, runCallbacks, true);
}
/**
 * @param {?} s
 * @return {?}
 */
export function disableTouchControl(s) {
    s.onlyExternal = true;
    return true;
}
/**
 * @param {?} s
 * @return {?}
 */
export function enableTouchControl(s) {
    s.onlyExternal = false;
    return true;
}
/**
 * @param {?} s
 * @return {?}
 */
function cleanupStyles(s) {
    if (!s.container || !s._wrapper) {
        // fix #10830
        return;
    }
    // Container
    if (s.container) {
        removeClass(s.container, s._classNames);
        s.container.removeAttribute('style');
    }
    // Wrapper
    s._wrapper.removeAttribute('style');
    // Slides
    if (s._slides && s._slides.length) {
        removeClass(s._slides, [
            CLS.slideVisible,
            CLS.slideActive,
            CLS.slideNext,
            CLS.slidePrev
        ]);
        for (var /** @type {?} */ i = 0; i < s._slides.length; i++) {
            var /** @type {?} */ slide = s._slides[i];
            slide.removeAttribute('style');
            slide.removeAttribute('data-swiper-column');
            slide.removeAttribute('data-swiper-row');
        }
    }
    // Pagination/Bullets
    removeClass(s._bullets, CLS.bulletActive);
    // Buttons
    removeClass(s.prevButton, CLS.buttonDisabled);
    removeClass(s.nextButton, CLS.buttonDisabled);
}
/**
 * @param {?} s
 * @return {?}
 */
export function destroySwiper(s) {
    // Stop autoplay
    stopAutoplay(s);
    // Destroy loop
    if (s.loop) {
        destroyLoop(s);
    }
    // Cleanup styles
    cleanupStyles(s);
}
//# sourceMappingURL=swiper.js.map