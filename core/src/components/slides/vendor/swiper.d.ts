// Type definitions for Swiper 4.2
// Project: https://github.com/nolimits4web/Swiper
// Definitions by: Sebastián Galiano <https://github.com/sgaliano>, Luca Trazzi <https://github.com/lucax88x>, Eugene Matseruk <https://github.com/ematseruk>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

type CommonEvent =
    | 'init'
    | 'beforeDestroy'
    | 'slideChange'
    | 'slideChangeTransitionStart'
    | 'slideChangeTransitionEnd'
    | 'slideNextTransitionStart'
    | 'slideNextTransitionEnd'
    | 'slidePrevTransitionStart'
    | 'slidePrevTransitionEnd'
    | 'transitionStart'
    | 'transitionEnd'
    | 'touchStart'
    | 'touchMove'
    | 'touchMoveOpposite'
    | 'sliderMove'
    | 'touchEnd'
    | 'click'
    | 'tap'
    | 'doubleTap'
    | 'imagesReady'
    | 'progress'
    | 'reachBeginning'
    | 'reachEnd'
    | 'fromEdge'
    | 'setTranslate'
    | 'setTransition'
    | 'resize';

type PaginationEvent = 'paginationRender' | 'paginationUpdate';
type AutoplayEvent = 'autoplayStart' | 'autoplayStop' | 'autoplay';
type LazyLoadingEvent = 'lazyImageLoad' | 'lazyImageReady';

type SwiperEvent = CommonEvent | PaginationEvent | AutoplayEvent | LazyLoadingEvent;

interface NavigationOptions {
    nextEl?: string | HTMLElement;
    prevEl?: string | HTMLElement;
    hideOnClick?: boolean;
    disabledClass?: string;
    hiddenClass?: string;
}

interface PaginationOptions {
    el?: string;
    type?: 'bullets' | 'fraction' | 'progressbar' | 'custom';
    bulletElement?: string;
    dynamicBullets?: boolean;
    dynamicMainBullets?: number;
    hideOnClick?: boolean;
    clickable?: boolean;
    progressbarOpposite?: boolean;

    bulletClass?: string;
    bulletActiveClass?: string;
    modifierClass?: string;
    currentClass?: string;
    totalClass?: string;
    hiddenClass?: string;
    progressbarFillClass?: string;
    clickableClass?: string;

    renderBullet?: (index: number, className: string) => void;
    renderFraction?: (currentClass: string, totalClass: string) => void;
    renderProgressbar?: (progressbarFillClass: string) => void;
    renderCustom?: (swiper: Swiper, current: number, total: number) => void;
}

interface ScrollbarOptions {
    el?: string | HTMLElement;
    hide?: boolean;
    draggable?: boolean;
    snapOnRelease?: boolean;
    dragSize?: 'auto' | number;
    lockClass?: 'string';
    dragClass?: 'string';
}

interface AutoplayOptions {
    delay?: number;
    stopOnLastSlide?: boolean;
    disableOnInteraction?: boolean;
    reverseDirection?: boolean;
    waitForTransition?: boolean;
}

interface LazyLoadingOptions {
    loadPrevNext?: string;
    loadPrevNextAmount?: number;
    loadOnTransitionStart?: boolean;
    elementClass?: string;
    loadingClass?: string;
    loadedClass?: string;
    preloaderClass?: string;
}

interface FadeEffectOptions {
    crossFade: boolean;
}

interface CoverflowEffectOptions {
    slideShadows?: boolean;
    rotate?: number;
    stretch?: number;
    depth?: number;
    modifier?: number;
}

interface FlipEffectOptions {
    slideShadows?: boolean;
    limitRotation?: boolean;
}

interface CubeEffectOptions {
    slideShadows?: boolean;
    shadow?: boolean;
    shadowOffset: number;
    shadowScale: number;
}

interface ZoomOptions {
    maxRatio?: number;
    minRatio?: number;
    toggle?: boolean;
    containerClass?: string;
    zoomedSlideClass?: string;
}

interface KeyboardControlOptions {
    enabled?: boolean;
    onlyInViewport?: boolean;
}

interface MouseWheelControlOptions {
    forceToAxis?: boolean;
    releaseOnEdges?: boolean;
    invert?: boolean;
    sensitivity?: number;
    eventsTarged?: string | HTMLElement;
}

interface VirtualSlidesRenderExternalData {
    offset: number;
    from: number;
    to: number;
    slides: any[];
}

interface VirtualSlidesOptions {
    slides?: any[];
    cache?: boolean;
    renderSlide?: (slide: any, index: number) => void;
    renderExternal?: (data: VirtualSlidesRenderExternalData) => void;
}

interface HashNavigationOptions {
    watchState?: boolean;
    replaceState?: boolean;
}

interface HistoryNavigationOptions {
    replaceState?: boolean;
    key?: string;
}

interface ControllerOptions {
    control: Swiper;
    inverse: boolean;
    by: 'slide' | 'container';
}

interface AccessibilityOptions {
    enabled?: boolean;
    prevSlideMessage?: string;
    nextSlideMessage?: string;
    firstSlideMessage?: string;
    lastSlideMessage?: string;
    paginationBulletMessage?: string;
    notificationClass?: string;
}

export interface SwiperOptions {
    // General parameters
    init?: boolean;
    initialSlide?: number;
    direction?: 'horizontal' | 'vertical';
    speed?: number;
    setWrapperSize?: boolean;
    virtualTranslate?: boolean;
    width?: number;
    height?: number;
    autoHeight?: boolean;
    roundLengths?: boolean;
    nested?: boolean;
    uniqueNavElements?: boolean;
    effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
    runCallbacksOnInit?: boolean;
    watchOverflow?: boolean;
    on?: {[key in SwiperEvent]?: () => void };

    // Slides grid
    spaceBetween?: number;
    slidesPerView?: 'auto' | number;
    slidesPerColumn?: number;
    slidesPerColumnFill?: 'row' | 'column';
    slidesPerGroup?: number;
    centeredSlides?: boolean;
    slidesOffsetBefore?: number;
    slidesOffsetAfter?: number;
    normalizeSlideIndex?: boolean;

    // Grab cursor
    grabCursor?: boolean;

    // Touches
    touchEventsTarget?: 'container' | 'wrapper';
    touchRatio?: number;
    touchAngle?: number;
    simulateTouch?: boolean;
    shortSwipes?: boolean;
    longSwipes?: boolean;
    longSwipesRatio?: number;
    longSwipesMs?: number;
    followFinger?: boolean;
    allowTouchMove?: boolean;
    threshold?: number;
    touchMoveStopPropagation?: boolean;
    iOSEdgeSwipeDetection?: boolean;
    iOSEdgeSwipeThreshold?: number;
    touchReleaseOnEdges?: boolean;
    passiveListeners?: boolean;

    // Touch Resistance
    resistance?: boolean;
    resistanceRatio?: number;

    // Swiping / No swiping
    preventIntercationOnTransition?: boolean;
    allowSlidePrev?: boolean;
    allowSlideNext?: boolean;
    noSwiping?: boolean;
    noSwipingClass?: string;
    noSwipingSelector?: string;
    swipeHandler?: string | HTMLElement;

    // Clicks
    preventClicks?: boolean;
    preventClicksPropagation?: boolean;
    slideToClickedSlide?: boolean;

    // Freemode
    freeMode?: boolean;
    freeModeMomentum?: boolean;
    freeModeMomentumRatio?: number;
    freeModeMomentumVelocityRatio?: number;
    freeModeMomentumBounce?: boolean;
    freeModeMomentumBounceRatio?: number;
    freeModeMinimumVelocity?: number;
    freeModeSticky?: boolean;

    // Progress
    watchSlidesProgress?: boolean;
    watchSlidesVisibility?: boolean;

    // Images
    preloadImages?: boolean;
    updateOnImagesReady?: boolean;
    // Loop
    loop?: boolean;
    loopAdditionalSlides?: number;
    loopedSlides?: number;
    loopFillGroupWithBlank?: boolean;

    // Breakpoints
    breakpoints?: {
        // TODO: extract possible parameters for breakpoints to separate interface
        [index: number]: any;
    };

    // Observer
    observer?: boolean;
    observeParents?: boolean;

    // Namespace
    containerModifierClass?: string;
    slideClass?: string;
    slideActiveClass?: string;
    slideDuplicatedActiveClass?: string;
    slideVisibleClass?: string;
    slideDuplicateClass?: string;
    slideNextClass?: string;
    slideDuplicatedNextClass?: string;
    slidePrevClass?: string;
    slideDuplicatedPrevClass?: string;
    wrapperClass?: string;

    // Components
    navigation?: NavigationOptions;
    pagination?: PaginationOptions;
    scrollbar?: ScrollbarOptions;
    autoplay?: AutoplayOptions;
    parallax?: boolean;
    lazy?: LazyLoadingOptions | boolean;
    fadeEffect?: FadeEffectOptions;
    coverflowEffect?: CoverflowEffectOptions;
    flipEffect?: FlipEffectOptions;
    cubeEffect?: CubeEffectOptions;
    zoom?: ZoomOptions | boolean;
    keyboard?: KeyboardControlOptions | boolean;
    mousewheel?: MouseWheelControlOptions | boolean;
    virtual?: VirtualSlidesOptions;
    hashNavigation?: HashNavigationOptions;
    history?: HistoryNavigationOptions;
    controller?: ControllerOptions;
    a11y?: AccessibilityOptions;
}

interface Navigation {
    nextEl: HTMLElement;
    prevEl: HTMLElement;
    update: () => void;
}
interface Pagination {
    el: HTMLElement;
    // TODO: dom7 like array
    bullets: any[];

    render: () => void;
    update: () => void;
}

interface Scrollbar {
    eL: HTMLElement;
    dragEl: HTMLElement;

    updateSize: () => void;
}

interface Autoplay {
    running: boolean;

    start: () => void;
    stop: () => void;
}

interface LazyLoading {
    load: () => void;
    loadInSlide: (index: number) => void;
}

interface Zoom {
    enabled: boolean;
    scale: number;

    enable: () => void;
    disable: () => void;
    in: () => void;
    out: () => void;
    toggle: () => void;
}

// Keyboard and Mousewheel control
interface Control {
    enabled: boolean;

    enable: () => void;
    disable: () => void;
}

interface VirtualSlides {
    cache: any;
    from: number;
    to: number;
    slides: any[];

    appendSlide: (slide: any) => void;
    prependSlide: (slide: any) => void;
    update: () => void;
}

interface Controller {
    control: Swiper;
}

export declare class Swiper {
    constructor(container: string | Element, parameters?: SwiperOptions);

    // Properties
    params: SwiperOptions;
    // TODO: dom7 element
    $el: any;
    // TODO: dom7 element
    $wrapperEl: any;
    slides: HTMLElement[];
    width: number;
    height: number;
    translate: number;
    progress: number;
    activeIndex: number;
    realIndex: number;
    previousIndex: number;
    isBeginning: boolean;
    isEnd: boolean;
    animating: boolean;
    touches: {
        startX: number;
        startY: number;
        currentX: number;
        currentY: number;
        diff: number;
    };
    clickedIndex: number;
    clickedSlide: HTMLElement;
    allowSlideNext: boolean;
    allowSlidePrev: boolean;
    allowTouchMove: boolean;

    slideNext: (speed?: number, runCallbacks?: boolean) => void;
    slidePrev: (speed?: number, runCallbacks?: boolean) => void;
    slideTo: (index: number, speed?: number, runCallbacks?: boolean) => void;
    slideToLoop: (index: number, speed?: number, runCallbacks?: boolean) => void;
    slideReset: (speed?: number, runCallbacks?: boolean) => void;
    slideToClosest: (speed?: number, runCallbacks?: boolean) => void;
    updateAutoHeight: (speed?: number) => void;
    update: () => void;
    detachEvents: () => void;
    attachEvents: () => void;
    destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
    appendSlide: (slides: Array<(HTMLElement | string)> | string | HTMLElement) => void;
    prependSlide: (slides: Array<(HTMLElement | string)> | string | HTMLElement) => void;
    removeSlide: (index: number) => void;
    removeAllSlides: () => void;
    setTranslate: (translate: number) => void;
    getTranslate: () => void;
    on: (event: SwiperEvent, handler: () => void) => void;
    once: (event: SwiperEvent, handler: () => void) => void;
    off: (event: SwiperEvent, handler?: () => void) => void;
    unsetGrabCursor: () => void;
    setGrabCursor: () => void;

    // components
    navigation: Navigation;
    pagination: Pagination;
    scrollbar: Scrollbar;
    autoplay: Autoplay;
    zoom: Zoom;
    keyboard: Control;
    mousewheel: Control;
    virtual: VirtualSlides;
    controller: Controller;
}

