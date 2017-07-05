import { CLS, addClass, eachChild, isHorizontal, removeClass, transform, transition } from './swiper-utils';
import { Slides } from '../slides';


/*=========================
  Pagination
  ===========================*/
export function updatePagination(s: Slides) {
  if (!s.paginationType || !s._paginationContainer) return;

  var paginationHTML = '';

  if (s.paginationType === 'bullets') {
    var numberOfBullets = s.loop ? Math.ceil((s._slides.length - s.loopedSlides * 2) / s.slidesPerGroup) : s._snapGrid.length;
    for (var i = 0; i < numberOfBullets; i++) {
      if (s.paginationBulletRender) {
        paginationHTML += s.paginationBulletRender(i, CLS.bullet);
      } else {
        paginationHTML += `<button class="${CLS.bullet}" aria-label="Go to slide ${i + 1}" data-slide-index="${i}"></button>`;
      }
    }

  } else if (s.paginationType === 'fraction') {
    paginationHTML =
      '<span class="' + CLS.paginationCurrent + '"></span>' +
      ' / ' +
      '<span class="' + CLS.paginationTotal + '"></span>';

  } else if (s.paginationType === 'progress') {
    paginationHTML = '<span class="' + CLS.paginationProgressbar + '"></span>';
  }

  s._paginationContainer.innerHTML = paginationHTML;

  s._bullets = <any>s._paginationContainer.querySelectorAll('.' + CLS.bullet);
}


export function updatePaginationClasses(s: Slides) {
  // Current/Total
  var current: number;
  var total = s.loop ? Math.ceil((s._slides.length - s.loopedSlides * 2) / s.slidesPerGroup) : s._snapGrid.length;

  if (s.loop) {
    current = Math.ceil((s._activeIndex - s.loopedSlides) / s.slidesPerGroup);
    if (current > s._slides.length - 1 - s.loopedSlides * 2) {
      current = current - (s._slides.length - s.loopedSlides * 2);
    }
    if (current > total - 1) {
      current = current - total;
    }
    if (current < 0 && s.paginationType !== 'bullets') {
      current = total + current;
    }

  } else {
    if (typeof s._snapIndex !== 'undefined') {
      current = s._snapIndex;
    } else {
      current = s._activeIndex || 0;
    }
  }

  // Types
  if (s.paginationType === 'bullets' && s._bullets) {
    var selector = current + ( current < 0 ? s._bullets.length : 0 );
    for (var i = 0; i < s._bullets.length; i++) {
      if (i === selector) {
        addClass(s._bullets[i], CLS.bulletActive);
      } else {
        removeClass(s._bullets[i], CLS.bulletActive);
      }
    }
  }

  if (s.paginationType === 'fraction') {
    eachChild(s._paginationContainer, '.' + CLS.paginationCurrent, (ele) => {
      ele.textContent = <any>(current + 1);
    });
    eachChild(s._paginationContainer, '.' + CLS.paginationTotal, ele => {
      ele.textContent = total;
    });
  }

  if (s.paginationType === 'progress') {
    var scale = (current + 1) / total,
      scaleX = scale,
      scaleY = 1;
    if (!isHorizontal(s)) {
      scaleY = scale;
      scaleX = 1;
    }
    eachChild(s._paginationContainer, '.' + CLS.paginationProgressbar, ele => {
      transform(ele, 'translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')');
      transition(ele, s.speed);
    });
  }
}
