
export class FeatureDetect {
  private _results: any = {};

  run(window: Window, document: Document) {
    for (let name in featureDetects) {
      this._results[name] = featureDetects[name](window, document, document.body);
    }
  }

  has(featureName: string) {
    return !!this._results[featureName];
  }

  static add(name: string, fn: any) {
    featureDetects[name] = fn;
  }

}

let featureDetects = {};


FeatureDetect.add('hairlines', function(window: Window, document: Document, body: HTMLBodyElement) {
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
