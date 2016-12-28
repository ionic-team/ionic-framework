import { Slides } from '../slides';
import { isHorizontal, round, transform, transition, maxTranslate, minTranslate } from './swiper-utils';
import { parallaxSetTransition, parallaxSetTranslate } from './swiper-parallax';
import { Platform } from '../../../platform/platform';
import { updateProgress } from './swiper-progress';
import { updateActiveIndex } from './swiper-index';


export function setWrapperTranslate(s: Slides, plt: Platform, translate: any, shouldUpdateActiveIndex?: boolean, byController?: any) {
  var x = 0, y = 0, z = 0;
  if (isHorizontal(s)) {
    x = s.rtl ? -translate : translate;
  } else {
    y = translate;
  }

  if (s.params.roundLengths) {
    x = round(x);
    y = round(y);
  }

  if (!s.params.virtualTranslate) {
    transform(s.wrapper, 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
  }

  s.translate = isHorizontal(s) ? x : y;

  // Check if we need to update progress
  var progress;
  var translatesDiff = maxTranslate(s) - minTranslate(s);

  if (translatesDiff === 0) {
    progress = 0;
  } else {
    progress = (translate - minTranslate(s)) / (translatesDiff);
  }

  if (progress !== s.progress) {
    updateProgress(s, translate);
  }

  if (shouldUpdateActiveIndex) {
    updateActiveIndex(s);
  }

  if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
    s.effects[s.params.effect].setTranslate(s, plt);
  }

  if (s.params.parallax) {
    parallaxSetTranslate(s);
  }

  s.ionSetTranslate.emit(s.translate);
}


function getTranslate(s: Slides, plt: Platform, el: HTMLElement, axis: string) {
  var win: any = plt.win();
  var matrix, curTransform, curStyle, transformMatrix;

  // automatic axis detection
  if (typeof axis === 'undefined') {
    axis = 'x';
  }

  if (s.params.virtualTranslate) {
    return s.rtl ? -s.translate : s.translate;
  }

  curStyle = plt.getElementComputedStyle(el);
  if (win.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(function(a){
        return a.replace(',', '.');
      }).join(', ');
    }
    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);

  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }

  if (axis === 'x') {
    if (win.WebKitCSSMatrix) {
      // Latest Chrome and webkits Fix
      curTransform = transformMatrix.m41;
    } else if (matrix.length === 16) {
      // Crazy IE10 Matrix
      curTransform = parseFloat(matrix[12]);
    } else {
      // Normal Browsers
      curTransform = parseFloat(matrix[4]);
    }
  }
  if (axis === 'y') {
    if (win.WebKitCSSMatrix) {
      // Latest Chrome and webkits Fix
      curTransform = transformMatrix.m42;
    } else if (matrix.length === 16) {
      // Crazy IE10 Matrix
      curTransform = parseFloat(matrix[13]);
    } else {
      // Normal Browsers
      curTransform = parseFloat(matrix[5]);
    }
  }
  if (s.rtl && curTransform) {
    curTransform = -curTransform;
  }
  return curTransform || 0;
}

export function getWrapperTranslate(s: Slides, plt: Platform, axis?: any) {
  if (typeof axis === 'undefined') {
    axis = isHorizontal(s) ? 'x' : 'y';
  }
  return getTranslate(s, plt, s.wrapper, axis);
}

export function setWrapperTransition(s: Slides, plt: Platform, duration: number, byController?: any) {
  transition(s.wrapper, duration);

  if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
    s.effects[s.params.effect].setTransition(s, plt, duration);
  }

  if (s.params.parallax) {
    parallaxSetTransition(s, duration);
  }

  s.ionSetTransition.emit(duration);
}
