import { Slides } from '../slides';
import { updateClasses } from './swiper-classes';


export function updateActiveIndex(s: Slides) {
  var translate = s._rtl ? s._translate : -s._translate;
  var newActiveIndex: number;
  var i: number;
  var snapIndex: number;

  for (i = 0; i < s._slidesGrid.length; i ++) {
    if (typeof s._slidesGrid[i + 1] !== 'undefined') {
      if (translate >= s._slidesGrid[i] && translate < s._slidesGrid[i + 1] - (s._slidesGrid[i + 1] - s._slidesGrid[i]) / 2) {
        newActiveIndex = i;
      } else if (translate >= s._slidesGrid[i] && translate < s._slidesGrid[i + 1]) {
        newActiveIndex = i + 1;
      }
    } else {
      if (translate >= s._slidesGrid[i]) {
        newActiveIndex = i;
      }
    }
  }

  snapIndex = Math.floor(newActiveIndex / s.slidesPerGroup);
  if (snapIndex >= s._snapGrid.length) snapIndex = s._snapGrid.length - 1;

  if (newActiveIndex === s._activeIndex) {
    return;
  }
  s._snapIndex = snapIndex;
  s._previousIndex = s._activeIndex;
  s._activeIndex = newActiveIndex;

  updateClasses(s);
  updateRealIndex(s);
}

export function updateRealIndex(s: Slides) {
  var activeSlide = <any>s._slides[s._activeIndex];
  if (activeSlide) {
    s.realIndex = parseInt(activeSlide.getAttribute('data-swiper-slide-index') || s._activeIndex, 10);
  }
}
