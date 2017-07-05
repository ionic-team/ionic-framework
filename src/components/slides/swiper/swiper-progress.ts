import { Slides } from '../slides';
import { CLS, maxTranslate, minTranslate, removeClass, updateSlidesOffset } from './swiper-utils';


export function updateProgress(s: Slides, translate?: number) {
  if (typeof translate === 'undefined') {
    translate = s._translate || 0;
  }
  var translatesDiff = maxTranslate(s) - minTranslate(s);
  var wasBeginning = s._isBeginning;
  var wasEnd = s._isEnd;

  if (translatesDiff === 0) {
    s.progress = 0;
    s._isBeginning = s._isEnd = true;

  } else {
    s.progress = (translate - minTranslate(s)) / (translatesDiff);
    s._isBeginning = s.progress <= 0;
    s._isEnd = s.progress >= 1;
  }

  s._zone.run(() => {
    if (s._isBeginning && !wasBeginning) {
      s.ionSlideReachStart.emit();
    }

    if (s._isEnd && !wasEnd) {
      s.ionSlideReachEnd.emit();
    }

    if (s.watchSlidesProgress) {
      updateSlidesProgress(s, translate);
    }

    s.ionSlideProgress.emit(s.progress);
  });
}


function updateSlidesProgress(s: Slides, translate: number) {
  if (typeof translate === 'undefined') {
    translate = s._translate || 0;
  }
  if (s._slides.length === 0) return;
  if (typeof s._slides[0].swiperSlideOffset === 'undefined') {
    updateSlidesOffset(s);
  }

  var offsetCenter = -translate;
  if (s._rtl) offsetCenter = translate;

  // Visible Slides
  removeClass(s._slides, CLS.slideVisible);

  for (var i = 0; i < s._slides.length; i++) {
    var slide = s._slides[i];
    var slideProgress = (offsetCenter + (s.centeredSlides ? minTranslate(s) : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.spaceBetween);
    if (s.watchSlidesVisibility) {
      var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
      var slideAfter = slideBefore + s._slidesSizesGrid[i];
      var isVisible =
        (slideBefore >= 0 && slideBefore < s._renderedSize) ||
        (slideAfter > 0 && slideAfter <= s._renderedSize) ||
        (slideBefore <= 0 && slideAfter >= s._renderedSize);
      if (isVisible) {
        s._slides[i].classList.add(CLS.slideVisible);
      }
    }
    slide.progress = s._rtl ? -slideProgress : slideProgress;
  }
}
