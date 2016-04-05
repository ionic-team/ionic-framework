import {Component, Input, HostBinding, ViewChild, ElementRef} from 'angular2/core';

import {isPresent} from '../../util/util';
import {Platform} from '../../platform/platform';


@Component({
  selector: 'ion-img',
  template:
    '<div *ngIf="_useA" class="img-placeholder" [style.height]="_h" [style.width]="_w"></div>' +
    '<img #imgA *ngIf="_useA" (load)="_onLoad()" [src]="_srcA" [style.height]="_h" [style.width]="_w">' +
    '<div *ngIf="!_useA" class="img-placeholder" [style.height]="_h" [style.width]="_w"></div>' +
    '<img #imgB *ngIf="!_useA" (load)="_onLoad()" [src]="_srcB" [style.height]="_h" [style.width]="_w">'
})
export class Img {
  private _src: string = '';
  private _srcA: string = '';
  private _srcB: string = '';
  private _useA: boolean = true;
  private _w: string;
  private _h: string;
  private _enabled: boolean = true;

  constructor(private _elementRef: ElementRef, private _platform: Platform) {}

  @ViewChild('imgA') private _imgA: ElementRef;
  @ViewChild('imgB') private _imgB: ElementRef;

  @Input()
  set src(val: string) {
    val = (isPresent(val) ? val : '');

    if (this._src !== val) {
      this._src = val;
      this._loaded = false;
      this._srcA = this._srcB = '';
      this._useA = !this._useA;
      this._update();
    }
  }

  private _update() {
    if (this._enabled && this.isVisible()) {
      if (this._useA) {
        this._srcA = this._src;

      } else {
        this._srcB = this._src;
      }
    }
  }

  enable(shouldEnable: boolean) {
    this._enabled = shouldEnable;
    this._update();
  }

  isVisible() {
    let bounds = this._elementRef.nativeElement.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < this._platform.height();
  }

  @HostBinding('class.img-loaded')
  private _loaded: boolean = false;

  private _onLoad() {
    this._loaded = this.isLoaded();
  }

  isLoaded() {
    let imgEle: HTMLImageElement;

    if (this._useA && this._imgA) {
      imgEle = this._imgA.nativeElement;

    } else if (this._imgB) {
      imgEle = this._imgB.nativeElement;

    }
    return (imgEle && imgEle.src !== '' && imgEle.complete);
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
