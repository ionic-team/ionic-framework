import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnDestroy, Optional, Renderer, ViewEncapsulation } from '@angular/core';

import { Content } from '../content/content';
import { DomController } from '../../util/dom-controller';
import { ImgLoader, ImgResponseMessage } from './img-loader';
import { isPresent, isTrueProperty } from '../../util/util';
import { Platform } from '../../platform/platform';


/**
 * @name Img
 * @description
 * Two of the biggest cuprits of scrolling jank is starting up a new
 * HTTP request, and rendering images. These two reasons is largely why
 * `ion-img` was created and the problems which it is helping to solve.
 * The standard `<img>` element is often a large source of these problems,
 * and what makes matters worse is that the app does not have fine-grained
 * control of each img element.
 *
 * The `ion-img` component is similar to the standard `<img>` element,
 * but it also adds features in order to provide improved performance.
 * Features include only loading images which are visible, using web workers
 * for HTTP requests, preventing jank while scrolling and in-memory caching.
 *
 * Note that `ion-img` also comes with a few more restrictions in comparison to
 * the standard `<img>` element. A good rule is, if there are only a few images
 * to be rendered on one page, then the standard `<img>` may be best. However, if
 * a page has the potential for hundreds or even thousands of images within a
 * scrollable area, then `ion-img` would be better suited for the job.
 *
 *
 * ### Lazy Loading
 *
 * Lazy loading images refers to only loading images which are actually
 * visible within the user's viewport. This also means that images which are
 * not viewable on the initial load would not be downloaded. Next, as the user
 * scrolls down, each image which becomes visible is then loaded on-demand.
 *
 * The benefits of this approach is that unnecessary HTTP requests are not
 * started and valuable bandwidth wasted, and to free up browser resources
 * which would be wasted on images which are not even viewable. For example,
 * animated GIFs are enourmous performance drains, however, with `ion-img`
 * the app is able to dedicate resources to just the viewable images.
 *
 *
 * ### Image Dimensions
 *
 * By providing image dimensions up front, Ionic is able to accurately size
 * up the image's location within the viewport, which helps lazy load only
 * images which are viewable. Image dimensions can either by set as properties,
 * inline styles, or stylesheets. It doesn't matter which method of setting
 * dimensions is used, but it's important that somehow each `ion-img`
 * has been given an exact size.
 *
 * For example, by default `<ion-avatar>` and `<ion-thumbnail>` already come
 * with exact sizes when placed within `<ion-item>`. By giving each image an
 * exact size, this then further locks in the size of each `ion-item`, which
 * again helps improve scroll performance.
 *
 * @usage
 * ```html
 * <!-- set using plain attributes -->
 * <ion-img width="80" height="80" src="..."></ion-img>
 *
 * <!-- bind using properties -->
 * <ion-img [width]="imgWidth" [height]="imgHeight" src="..."></ion-img>
 *
 * <!-- inline styles -->
 * <ion-img style="width: 80px; height: 80px;" src="..."></ion-img>
 * ```
 *
 *
 * ### Web Worker and XHR Requests
 *
 * Another big cause of scroll jank is kicking off a new HTTP request, which
 * is exactly what images do. Normally, this isn't a problem for something like
 * a blog since all image HTTP requests are started immediately as HTML
 * parses. However, Ionic has the ability to include hundreds to thousands of
 * images within one page, but we're not actually loading all of the images at once.
 *
 * Imagine an app where users can slowly, or quickly, scroll through hundreds of
 * images. If they're scrolling extremely fast, the app wouldn't want to start all of
 * those requests, but if they're scrolling slowly they would. Additionally, it's
 * most browsers can only have six requests at one time for the same domain, so
 * it's extemely important that we're managing which images we should downloading.
 *
 * By place XMLHttpRequest within a web worker, we're able to pass off the heavy
 * lifting to another thread. Not only are able to take the load of the main thread,
 * but we're also able to accurately control exactly which images should be
 * downloading, along with the ability to abort unnecessary requests. Aborting
 * requets is just as important so that Ionic can free up connections for the most
 * important images which are visible.
 *
 */
@Component({
  selector: 'ion-img',
  template: '<img>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Img implements OnDestroy {
  /** @internal */
  _src: string;
  /** @internal */
  _requestingSrc: string;
  /** @internal */
  _renderedSrc: string;
  /** @internal */
  _tmpDataUri: string;
  /** @internal */
  _cache: boolean = true;
  /** @internal */
  _cb: Function;
  /** @internal */
  _bounds: any;
  /** @internal */
  _rect: any;
  /** @internal */
  _w: string = '';
  /** @internal */
  _h: string = '';
  /** @internal */
  _wQ: string = '';
  /** @internal */
  _hQ: string = '';

  /** @private */
  canRequest: boolean;
  /** @private */
  canRender: boolean;


  constructor(
    private _ldr: ImgLoader,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    private _platform: Platform,
    private _zone: NgZone,
    @Optional() private _content: Content,
    private _dom: DomController
  ) {
    if (!this._content) {
      console.warn(`ion-img can only be used within an ion-content`);
    } else {
      this._content.addImg(this);
    }
    this._isLoaded(false);
  }

  /**
   * @input {string} Image src.
   */
  @Input()
  get src(): string {
    return this._src;
  }
  set src(newSrc: string) {
    if (newSrc !== this._src) {
      this.reset();

      // update to the new src
      this._src = newSrc;

      // reset any existing datauri we might be holding onto
      this._tmpDataUri = null;

      this.update();
    }
  }

  /**
   * @private
   */
  reset() {
    if (this._requestingSrc) {
      // abort any active requests
      console.debug(`abortRequest ${this._requestingSrc} ${Date.now()}`);
      this._ldr.abort(this._requestingSrc);
      this._requestingSrc = null;
    }
    if (this._renderedSrc) {
      // clear out the currently rendered img
      console.debug(`clearRender ${this._renderedSrc} ${Date.now()}`);
      this._renderedSrc = null;
      this._isLoaded(false);
    }
  }

  /**
   * @private
   */
  update() {
    if (this._src && this._content.isImgsRefreshable()) {
      if (this.canRequest && (this._src !== this._renderedSrc && this._src !== this._requestingSrc) && !this._tmpDataUri) {
        console.debug(`request ${this._src} ${Date.now()}`);
        this._requestingSrc = this._src;

        this._cb = (msg: ImgResponseMessage) => {
          this._loadResponse(msg);
        };

        this._ldr.load(this._src, this._cache, this._cb);
        this._setDims();
      }

      if (this.canRender && this._tmpDataUri && this._src !== this._renderedSrc) {
        // we can render and we have a datauri to render
        this._renderedSrc = this._src;
        this._setDims();
        this._dom.write(() => {
          if (this._tmpDataUri) {
            console.debug(`render ${this._src} ${Date.now()}`);
            this._isLoaded(true);
            this._srcAttr(this._tmpDataUri);
            this._tmpDataUri = null;
          }
        });
      }
    }
  }

  private _loadResponse(msg: ImgResponseMessage) {
    this._requestingSrc = null;

    if (msg.status === 200) {
      // success :)
      this._tmpDataUri = msg.data;
      this.update();

    } else {
      // error :(
      console.error(`img, status: ${msg.status} ${msg.msg}`);
      this._renderedSrc = this._tmpDataUri = null;
      this._dom.write(() => {
        this._isLoaded(false);
      });
    }
  }

  /**
   * @internal
   */
  _isLoaded(isLoaded: boolean) {
    const renderer = this._renderer;
    const ele = this._elementRef.nativeElement;
    renderer.setElementClass(ele, 'img-loaded', isLoaded);
    renderer.setElementClass(ele, 'img-unloaded', !isLoaded);
  }

  /**
   * @internal
   */
  _srcAttr(srcAttr: string) {
    const imgEle = this._elementRef.nativeElement.firstChild;
    const renderer = this._renderer;

    renderer.setElementAttribute(imgEle, 'src', srcAttr);
    renderer.setElementAttribute(imgEle, 'alt', this.alt);
  }

  /**
   * @private
   */
  get top(): number {
    const bounds = this._getBounds();
    return bounds && bounds.top || 0;
  }

  /**
   * @private
   */
  get bottom(): number {
    const bounds = this._getBounds();
    return bounds && bounds.bottom || 0;
  }

  private _getBounds() {
    if (this._bounds) {
      return this._bounds;
    }
    if (!this._rect) {
      this._rect = (<HTMLElement>this._elementRef.nativeElement).getBoundingClientRect();
      console.debug(`img, ${this._src}, read, ${this._rect.top} - ${this._rect.bottom}`);
    }
    return this._rect;
  }

  /**
   * @input {any}  Sets the bounding rectangle of the element relative to the viewport.
   * When using `VirtualScroll`, each virtual item should pass its bounds to each
   * `ion-img`.
   */
  @Input()
  set bounds(b: any) {
    if (isPresent(b)) {
      this._bounds = b;
    }
  }

  /**
   * @input {boolean}  After an image has been successfully downloaded, it can be cached
   * in-memory. This is useful for `VirtualScroll` by allowing image responses to be
   * cached, and not rendered, until after scrolling has completed, which allows for
   * smoother scrolling.
   */
  @Input()
  get cache(): boolean {
    return this._cache;
  }
  set cache(val: boolean) {
    this._cache = isTrueProperty(val);
  }

  /**
   * @input {string}  Image width. If this property is not set it's important that
   * the dimensions are still set using CSS.
   */
  @Input()
  set width(val: string | number) {
    this._wQ = getUnitValue(val);
    this._setDims();
  }

  /**
   * @input {string}  Image height. If this property is not set it's important that
   * the dimensions are still set using CSS.
   */
  @Input()
  set height(val: string | number) {
    this._hQ = getUnitValue(val);
    this._setDims();
  }

  private _setDims() {
    if (this.canRender && (this._w !== this._wQ || this._h !== this._hQ)) {
      var wrapperEle: HTMLImageElement = this._elementRef.nativeElement;
      var renderer = this._renderer;

      this._dom.write(() => {
        if (this._w !== this._wQ) {
          this._w = this._wQ;
          renderer.setElementStyle(wrapperEle, 'width', this._w);
        }
        if (this._h !== this._hQ) {
          this._h = this._hQ;
          renderer.setElementStyle(wrapperEle, 'height', this._h);
        }
      });
    }
  }

  /**
   * @input {string}  Set the `alt` attribute which gets assigned to
   * the inner `img` element.
   */
  @Input() alt: string = '';

  /**
   * @private
   */
  ngOnDestroy() {
    this._ldr.cancelLoad(this._cb);
    this._cb = null;
    this._content && this._content.removeImg(this);
  }

}

function getUnitValue(val: any): string {
  if (isPresent(val)) {
    if (typeof val === 'string') {
      if (val.indexOf('%') > -1 || val.indexOf('px') > -1) {
        return val;
      }
      if (val.length) {
        return val + 'px';
      }

    } else if (typeof val === 'number') {
      return val + 'px';
    }
  }
  return '';
}
