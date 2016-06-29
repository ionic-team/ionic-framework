
export class FeatureDetect {
  private _results: {[featureName: string]: boolean} = {};

  run(window: Window, document: Document) {
    for (let name in featureDetects) {
      this._results[name] = featureDetects[name](window, document, document.body);
    }
  }

  has(featureName: string): boolean {
    return !!this._results[featureName];
  }

  static add(name: string, fn: any) {
    featureDetects[name] = fn;
  }

}

let featureDetects: {[featureName: string]: Function} = {};


FeatureDetect.add('hairlines', function(window: Window, document: Document, body: HTMLBodyElement): boolean {
  /**
  * Hairline Shim
  * Add the "hairline" CSS class name to the body tag
  * if the browser supports subpixels.
  */
  let canDo = false;
  if (window.devicePixelRatio >= 2) {
    var hairlineEle = document.createElement('div');
    hairlineEle.style.border = '.5px solid transparent';
    body.appendChild(hairlineEle);

    if (hairlineEle.offsetHeight === 1) {
      body.classList.add('hairlines');
      canDo = true;
    }
    body.removeChild(hairlineEle);
  }
  return canDo;
});

FeatureDetect.add('backdrop-filter', function(window: Window, document: Document, body: HTMLBodyElement): boolean {
  /**
  * backdrop-filter Shim
  * Checks if css backdrop-filter is implemented by the browser.
  */
  let styles = <any>body.style;
  let backdrop = styles['backdrop-filter'] !== undefined ||
    styles['-webkit-backdrop-filter'] !== undefined;
  if (backdrop) {
    body.classList.add('backdrop-filter');
  }
  return backdrop;
});

