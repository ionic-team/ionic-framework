import { Slides } from '../slides';
import { updateClasses } from './swiper-classes';


export function updateActiveIndex(s: Slides) {
  var translate = s.rtl ? s.translate : -s.translate;
  var newActiveIndex, i, snapIndex;
  for (i = 0; i < s.slidesGrid.length; i ++) {
    if (typeof s.slidesGrid[i + 1] !== 'undefined') {
      if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
        newActiveIndex = i;
      } else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
        newActiveIndex = i + 1;
      }
    } else {
      if (translate >= s.slidesGrid[i]) {
        newActiveIndex = i;
      }
    }
  }
  // Normalize slideIndex
  if (s.params.normalizeSlideIndex) {
    if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
  }

  snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
  if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;

  if (newActiveIndex === s.activeIndex) {
    return;
  }
  s.snapIndex = snapIndex;
  s.previousIndex = s.activeIndex;
  s.activeIndex = newActiveIndex;

  updateClasses(s);
  updateRealIndex(s);
}

export function updateRealIndex(s: Slides) {
  s.realIndex = parseInt(<any>s.slides[s.activeIndex].getAttribute('data-swiper-slide-index') || s.activeIndex, 10);
}
