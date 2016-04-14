import {Component, Input, ElementRef, ChangeDetectionStrategy, ViewEncapsulation, NgZone} from 'angular2/core';

import {raf} from '../../util/dom';
import {isPresent} from '../../util/util';
import {Platform} from '../../platform/platform';


@Component({
  selector: 'ion-img',
  template:
    '<div class="img-placeholder" [style.height]="_h" [style.width]="_w"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Img {
  private _src: string = '';
  private _normalizeSrc: string = '';
  private _imgs: HTMLImageElement[] = [];
  private _w: string;
  private _h: string;
  private _enabled: boolean = true;

  constructor(private _elementRef: ElementRef, private _platform: Platform, private _zone: NgZone) {}

  @Input()
  set src(val: string) {
    let tmpImg = new Image();
    tmpImg.src = isPresent(val) ? val : '';

    this._src = isPresent(val) ? val : '';
    this._normalizeSrc = tmpImg.src;

    this._update();
  }

  private _update() {
    if (this._enabled && this._src !== '' && this.isVisible()) {
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
          img.style.width = this._w;
          img.style.height = this._h;

          img.addEventListener('load', () => {
            if (img.src === this._normalizeSrc) {
              this._elementRef.nativeElement.appendChild(img);
              raf(() => {
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

  private _loaded(isLoaded: boolean) {
    this._elementRef.nativeElement.classList[isLoaded ? 'add' : 'remove']('img-loaded');
  }

  enable(shouldEnable: boolean) {
    this._enabled = shouldEnable;
    this._update();
  }

  isVisible() {
    let bounds = this._elementRef.nativeElement.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < this._platform.height();
  }

  @Input()
  set width(val: string | number) {
    this._w = (typeof val === 'number') ? val + 'px' : val;
  }

  @Input()
  set height(val: string | number) {
    this._h = (typeof val === 'number') ? val + 'px' : val;
  }

}
