import { Slides } from '../slides';
import { maxTranslate, minTranslate, removeClass, updateSlidesOffset } from './swiper-utils';


export function updateProgress(s: Slides, translate?: number) {
  if (typeof translate === 'undefined') {
    translate = s.translate || 0;
  }
  var translatesDiff = maxTranslate(s) - minTranslate(s);
  var wasBeginning = s.isBeginning;
  var wasEnd = s.isEnd;

  if (translatesDiff === 0) {
    s.progress = 0;
    s.isBeginning = s.isEnd = true;

  } else {
    s.progress = (translate - minTranslate(s)) / (translatesDiff);
    s.isBeginning = s.progress <= 0;
    s.isEnd = s.progress >= 1;
  }

  if (s.isBeginning && !wasBeginning) {
    s.ionReachBeginning.emit();
  }
  if (s.isEnd && !wasEnd) {
    s.ionReachEnd.emit();
  }

  if (s.params.watchSlidesProgress) {
    updateSlidesProgress(s, translate);
  }

  s.ionProgress.emit(s.progress);
}


function updateSlidesProgress(s: Slides, translate: number) {
  if (typeof translate === 'undefined') {
    translate = s.translate || 0;
  }
  if (s.slides.length === 0) return;
  if (typeof s.slides[0].swiperSlideOffset === 'undefined') {
    updateSlidesOffset(s);
  }

  var offsetCenter = -translate;
  if (s.rtl) offsetCenter = translate;

  // Visible Slides
  removeClass(s.slides, s.params.slideVisibleClass);

  for (var i = 0; i < s.slides.length; i++) {
    var slide = s.slides[i];
    var slideProgress = (offsetCenter + (s.params.centeredSlides ? minTranslate(s) : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
    if (s.params.watchSlidesVisibility) {
      var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
      var slideAfter = slideBefore + s.slidesSizesGrid[i];
      var isVisible =
        (slideBefore >= 0 && slideBefore < s.size) ||
        (slideAfter > 0 && slideAfter <= s.size) ||
        (slideBefore <= 0 && slideAfter >= s.size);
      if (isVisible) {
        s.slides[i].classList.add(s.params.slideVisibleClass);
      }
    }
    slide.progress = s.rtl ? -slideProgress : slideProgress;
  }
}
