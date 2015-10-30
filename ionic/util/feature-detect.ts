
export class FeatureDetect {

  run(window, document) {
    this._results = {};
    for (let name in featureDetects) {
      this._results[name] = featureDetects[name](window, document, document.body);
    }
  }

  has(featureName) {
    return !!this._results[featureName];
  }

  static add(name, fn) {
    featureDetects[name] = fn;
  }

}

let featureDetects = {};


FeatureDetect.add('sticky', function(window, document) {
  // css position sticky
  let ele = document.createElement('div');
  ele.style.cssText = 'position:-webkit-sticky;position:sticky';
  return ele.style.position.indexOf('sticky') > -1;
});


FeatureDetect.add('hairlines', function(window, document, body) {
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
