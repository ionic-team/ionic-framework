import { ElementRef, OnDestroy, Renderer } from '@angular/core';
import { Img as IImg } from './img-interface';
import { Content } from '../content/content';
import { DomController } from '../../platform/dom-controller';
import { Platform } from '../../platform/platform';
/**
 * @name Img
 * @description
 * Two of the biggest cuprits of scroll jank is starting up a new HTTP
 * request, and rendering images. These two reasons is largely why
 * `ion-img` was created. The standard HTML `img` element is often a large
 * source of these problems, and what makes matters worse is that the app
 * does not have fine-grained control of requests and rendering for each
 * `img` element.
 *
 * The `ion-img` component is similar to the standard `img` element,
 * but it also adds features in order to provide improved performance.
 * Features include only loading images which are visible, using web workers
 * for HTTP requests, preventing jank while scrolling and in-memory caching.
 *
 * Note that `ion-img` also comes with a few more restrictions in comparison
 * to the standard `img` element. A good rule is, if there are only a few
 * images to be rendered on a page, then the standard `img` is probably
 * best. However, if a page has the potential for hundreds or even thousands
 * of images within a scrollable area, then `ion-img` would be better suited
 * for the job.
 *
 * > Note: `ion-img` is only meant to be used inside of [virtual-scroll](/docs/api/components/virtual-scroll/VirtualScroll/)
 *
 *
 * ### Lazy Loading
 *
 * Lazy loading images refers to only loading images which are actually
 * visible within the user's viewport. This also means that images which are
 * not viewable on the initial load would not be downloaded or rendered. Next,
 * as the user scrolls, each image which becomes visible is then requested
 * then rendered on-demand.
 *
 * The benefits of this approach is that unnecessary and resource intensive
 * HTTP requests are not started, valuable bandwidth isn't wasted, and this
 * allows the browser to free up resources which would be wasted on images
 * which are not even viewable. For example, animated GIFs are enourmous
 * performance drains, however, with `ion-img` the app is able to dedicate
 * resources to just the viewable images. But again, if the problems listed
 * above are not problems within your app, then the standard `img` element
 * may be best.
 *
 *
 * ### Image Dimensions
 *
 * By providing image dimensions up front, Ionic is able to accurately size
 * up the image's location within the viewport, which helps lazy load only
 * images which are viewable. Image dimensions can either by set as
 * properties, inline styles, or external stylesheets. It doesn't matter
 * which method of setting dimensions is used, but it's important that somehow
 * each `ion-img` has been given an exact size.
 *
 * For example, by default `<ion-avatar>` and `<ion-thumbnail>` already come
 * with exact sizes when placed within an `<ion-item>`. By giving each image
 * an exact size, this then further locks in the size of each `ion-item`,
 * which again helps improve scroll performance.
 *
 * ```html
 * <!-- dimensions set using attributes -->
 * <ion-img width="80" height="80" src="..."></ion-img>
 *
 * <!-- dimensions set using input properties -->
 * <ion-img [width]="imgWidth" [height]="imgHeight" src="..."></ion-img>
 *
 * <!-- dimensions set using inline styles -->
 * <ion-img style="width: 80px; height: 80px;" src="..."></ion-img>
 * ```
 *
 * Additionally, each `ion-img` uses the `object-fit: cover` CSS property.
 * What this means is that the actual rendered image will center itself within
 * it's container. Or to really get detailed: The image is sized to maintain
 * its aspect ratio while filling the containing element’s entire content box.
 * Its concrete object size is resolved as a cover constraint against the
 * element’s used width and height.
 *
 * ### Future Optimizations
 *
 * Future goals are to place image requests within web workers, and cache
 * images in-memory as datauris. This method has proven to be effective,
 * however there are some current limitations with Cordova which we are
 * currently working on.
 *
 */
export declare class Img implements OnDestroy, IImg {
    private _elementRef;
    private _renderer;
    private _plt;
    private _content;
    private _dom;
    /** @internal */
    _src: string;
    /** @internal */
    _requestingSrc: string;
    /** @internal */
    _renderedSrc: string;
    /** @internal */
    _hasLoaded: boolean;
    /** @internal */
    _cache: boolean;
    /** @internal */
    _bounds: any;
    /** @internal */
    _rect: any;
    /** @internal */
    _w: string;
    /** @internal */
    _h: string;
    /** @internal */
    _wQ: string;
    /** @internal */
    _hQ: string;
    /** @internal */
    _img: HTMLImageElement;
    /** @internal */
    _unreg: Function;
    /** @hidden */
    canRequest: boolean;
    /** @hidden */
    canRender: boolean;
    constructor(_elementRef: ElementRef, _renderer: Renderer, _plt: Platform, _content: Content, _dom: DomController);
    /**
     * @input {string} The source of the image.
     */
    src: string;
    /**
     * @hidden
     */
    reset(): void;
    /**
     * @hidden
     */
    update(): void;
    /**
     * @internal
     */
    _isLoaded(isLoaded: boolean): void;
    /**
     * @internal
     */
    _srcAttr(srcAttr: string): void;
    /**
     * @hidden
     */
    readonly top: number;
    /**
     * @hidden
     */
    readonly bottom: number;
    private _getBounds();
    /**
     * @input {any}  Sets the bounding rectangle of the element relative to the viewport.
     * When using `VirtualScroll`, each virtual item should pass its bounds to each
     * `ion-img`. The passed in data object should include `top` and `bottom` properties.
     */
    bounds: any;
    /**
     * @input {boolean}  After an image has been successfully downloaded, it can be cached
     * in-memory. This is useful for `VirtualScroll` by allowing image responses to be
     * cached, and not rendered, until after scrolling has completed, which allows for
     * smoother scrolling.
     */
    cache: boolean;
    /**
     * @input {string}  Image width. If this property is not set it's important that
     * the dimensions are still set using CSS. If the dimension is just a number it
     * will assume the `px` unit.
     */
    width: string | number;
    /**
     * @input {string}  Image height. If this property is not set it's important that
     * the dimensions are still set using CSS. If the dimension is just a number it
     * will assume the `px` unit.
     */
    height: string | number;
    private _setDims();
    /**
     * @input {string}  Set the `alt` attribute which gets assigned to
     * the inner `img` element.
     */
    alt: string;
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
}
