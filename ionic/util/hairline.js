
/**
 * Hairline Shim
 * Add the "hairline" CSS class name to the body tag
 * if the browser supports subpixels.
 */

(function(document){

  if (window.devicePixelRatio >= 2) {
    var hairlineEle = document.createElement('div');
    hairlineEle.style.border = '.5px solid transparent';
    document.body.appendChild(hairlineEle);

    if (hairlineEle.offsetHeight === 1) {
      document.body.classList.add('hairlines');
    }
    document.body.removeChild(hairlineEle);
  }

})(document);
