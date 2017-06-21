import { Component } from '@angular/core';
import { Platform } from '../../../../../../';

@Component({
  templateUrl: 'root-page.html'
})
export class RootPage {
  items: any[] = [];
  webview: string = '';
  type: string = 'range';
  testCheck: boolean;

  constructor(plt: Platform) {
    for (var i = 0; i < 200; i++) {
      if (i % 2 === 0) {
        this.changeType();
      }

      this.items.push({
        value: i,
        type: this.type,
        class: `item-${i}`
      });
    }

    if (plt.is('ios')) {
      if (plt.testUserAgent('Safari')) {
        this.webview = ': iOS Safari';

      } else if (!!(window as any)['webkit']) {
        this.webview = ': iOS WKWebView';

      } else {
        this.webview = ': iOS UIWebView';
      }
    }
  }

  changeType() {
    if (this.type === 'range') {
      this.type = 'checkbox';
    } else if (this.type === 'checkbox') {
      this.type = 'toggle';
    } else if (this.type === 'toggle') {
      this.type = 'radio';
    } else {
      this.type = 'range';
    }
  }

  reload() {
    window.location.reload(true);
  }

}
