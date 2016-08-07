import { Component, Input, HostBinding, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, NgZone } from '@angular/core';

import { nativeRaf } from '../../util/dom';
import { isPresent } from '../../util/util';
import { Platform } from '../../platform/platform';


/**
 * @private
 */
@Component({
  selector: 'ion-img',
  template:
    '<div class="img-placeholder" [style.height]="_h" [style.width]="_w"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Img {
  _src: string = '';
  _normalizeSrc: string = '';
  _imgs: HTMLImageElement[] = [];
  _w: string;
  _h: string;
  _enabled: boolean = true;
  _init: boolean;

  constructor(private _elementRef: ElementRef, private _platform: Platform, private _zone: NgZone) {}

  @Input()
  set src(val: string) {
    let tmpImg = new Image();
    tmpImg.src = isPresent(val) ? val : '';

    this._src = isPresent(val) ? val : '';
    this._normalizeSrc = tmpImg.src;

    if (this._init) {
      this._update();
    }
  }

  ngOnInit() {
    this._init = true;
    this._update();
  }

  _update() {
    if (this._enabled && this._src !== '') {
      // actively update the image

      for (var i = this._imgs.length - 1; i >= 0; i--) {
        if (this._imgs[i].src === this._normalizeSrc) {
          // this is the active image
          if (this._imgs[i].complete) {
            this._loaded(true);
          }

        } else {
          // no longer the active image
          if (this._imgs[i].parentElement) {
            this._imgs[i].parentElement.removeChild(this._imgs[i]);
          }
          this._imgs.splice(i, 1);
        }
      }

      if (!this._imgs.length) {
        this._zone.runOutsideAngular(() => {
          let img = new Image();
          img.style.width = this._width;
          img.style.height = this._height;

          if (isPresent(this.alt)) {
            img.alt = this.alt;
          }
          if (isPresent(this.title)) {
            img.title = this.title;
          }

          img.addEventListener('load', () => {
            if (img.src === this._normalizeSrc) {
              this._elementRef.nativeElement.appendChild(img);
              nativeRaf(() => {
                this._update();
              });
            }
          });

          img.src = this._src;

          this._imgs.push(img);
          this._loaded(false);
        });
      }

    } else {
      // do not actively update the image
      if (!this._imgs.some(img => img.src === this._normalizeSrc)) {
        this._loaded(false);
      }
    }
  }

  _loaded(isLoaded: boolean) {
    this._elementRef.nativeElement.classList[isLoaded ? 'add' : 'remove']('img-loaded');
  }

  enable(shouldEnable: boolean) {
    this._enabled = shouldEnable;
    this._update();
  }

  @Input()
  set width(val: string | number) {
    this._w = getUnitValue(val);
  }

  @Input()
  set height(val: string | number) {
    this._h = getUnitValue(val);
  }

  @Input() alt: string;

  @Input() title: string;

  @HostBinding('style.width')
  get _width(): string {
    return isPresent(this._w) ? this._w : '';
  }

  @HostBinding('style.height')
  get _height(): string {
    return isPresent(this._h) ? this._h : '';
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
