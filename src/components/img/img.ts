import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, OnDestroy, Optional, Renderer, ViewEncapsulation } from '@angular/core';

import { Content } from '../content/content';
import { DomController } from '../../util/dom-controller';
import { ImgLoader, ImgResponseMessage } from './img-loader';
import { isPresent, isTrueProperty } from '../../util/util';
import { Platform } from '../../platform/platform';


/**
 * @private
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
  _lazy: boolean = true;
  /** @internal */
  _ww: boolean = true;
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

  /**
   * @internal
   */
  _loadResponse(msg: ImgResponseMessage) {
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

  @Input()
  set bounds(b: any) {
    if (isPresent(b)) {
      this._bounds = b;
    }
  }

  @Input()
  get lazyLoad(): boolean {
    return this._lazy;
  }
  set lazyLoad(val: boolean) {
    this._lazy = isTrueProperty(val);
  }

  @Input()
  get webWorker(): boolean {
    return this._ww;
  }
  set webWorker(val: boolean) {
    this._ww = isTrueProperty(val);
  }

  @Input()
  get cache(): boolean {
    return this._cache;
  }
  set cache(val: boolean) {
    this._cache = isTrueProperty(val);
  }

  @Input()
  set width(val: string | number) {
    this._wQ = getUnitValue(val);
    this._setDims();
  }

  @Input()
  set height(val: string | number) {
    this._hQ = getUnitValue(val);
    this._setDims();
  }

  _setDims() {
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
   * Set the `alt` attribute on the inner `img` element.
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
