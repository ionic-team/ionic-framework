import { Component } from '@angular/core';
import { Platform } from '../../../../../src';

@Component({
  templateUrl: 'page-one.html'
})
export class PageOne {
  isIos: boolean;
  isAndroid: boolean;
  isWindows: boolean;

  constructor(platform: Platform) {
    this.isIos = platform.is('ios');
    this.isAndroid = platform.is('android');
    this.isWindows = platform.is('windows');
  }
}
