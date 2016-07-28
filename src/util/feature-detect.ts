
export class FeatureDetect {
  private _r: {[featureName: string]: boolean} = {};

  write(window: Window, document: Document) {
    for (let name in featureDetects) {
      featureDetects[name].write(window, document);
    }
  }

  read(window: Window, document: Document) {
    for (let name in featureDetects) {
      featureDetects[name].read && featureDetects[name].read(window, document);
    }
  }

  results(window: Window, document: Document) {
    for (let name in featureDetects) {
      this._r[name] = featureDetects[name].result(window, document);
    }
    featureDetects = null;
  }

  has(featureName: string): boolean {
    return !!this._r[featureName];
  }

  static add(name: string, test: any) {
    featureDetects[name] = new test();
  }

}

let featureDetects: {[featureName: string]: any} = {};

/**
* Hairline Feature Test
* Add the "hairline" CSS class name to the body tag
* if the browser supports subpixels.
*/
export class Hairlines {
  canDo: boolean;
  ele: HTMLElement;

  write(window: Window, document: Document) {
    if (window.devicePixelRatio >= 2) {
      this.ele = document.createElement('div');
      this.ele.style.border = '.5px solid transparent';
      this.ele.style.position = 'absolute';
      document.body.appendChild(this.ele);
    }
  }

  read(window: Window, document: Document) {
    this.canDo = !!(this.ele && this.ele.offsetHeight === 1);
  }

  result(window: Window, document: Document) {
    this.ele && document.body.removeChild(this.ele);
    this.ele = null;

    if (this.canDo) {
      document.body.classList.add('hairlines');
    }

    return this.canDo;
  }
}
FeatureDetect.add('hairlines', Hairlines);


/**
* backdrop-filter Test
* Checks if css backdrop-filter is implemented by the browser.
*/
export class BackdropFilter {
  yup: boolean;

  write(window: Window, document: Document) {
    this.yup = false;
    const styles = <any>document.documentElement.style;
    const backdrop = styles['backdrop-filter'] !== undefined || styles['-webkit-backdrop-filter'] !== undefined;
    if (backdrop) {
      document.body.classList.add('backdrop-filter');
      this.yup = true;
    }
  }

  result() {
    return this.yup;
  }
}

FeatureDetect.add('backdrop-filter', BackdropFilter);

