import { a11yDisable, a11yEnable } from './swiper-a11y';
import { addClass, eachChild, removeClass, isHorizontal, queryChildren, transform, transition } from './swiper-utils';
import { Slides } from '../slides';


/*=========================
  Classes
  ===========================*/
export function updateClasses(s: Slides) {
  var childElements;
  removeClass(s.slides, [s.params.slideActiveClass, s.params.slideNextClass, + s.params.slidePrevClass, s.params.slideDuplicateActiveClass, s.params.slideDuplicateNextClass, s.params.slideDuplicatePrevClass]);

  var activeSlide = s.slides[s.activeIndex];

  // Active classes
  addClass(activeSlide, s.params.slideActiveClass);

  if (s.params.loop) {
    // Duplicate to all looped slides
    if (activeSlide.classList.contains(s.params.slideDuplicateClass)) {
      childElements = queryChildren(s.wrapper, '.' + s.params.slideClass + ':not(.' + s.params.slideDuplicateClass + ')[data-swiper-slide-index="' + s.realIndex + '"]');

    } else {
      childElements = queryChildren(s.wrapper, '.' + s.params.slideClass + '.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + s.realIndex + '"]');
    }

    addClass(childElements, s.params.slideDuplicateActiveClass);
  }

  // Next Slide
  var nextSlide = activeSlide.nextElementSibling;
  if (s.params.loop && !nextSlide) {
    nextSlide = s.slides[0];
  }
  nextSlide && nextSlide.classList.add(s.params.slideNextClass);

  // Prev Slide
  var prevSlide = activeSlide.previousElementSibling;
  if (s.params.loop && !prevSlide) {
    prevSlide = s.slides[s.slides.length - 1];
  }
  prevSlide && prevSlide.classList.add(s.params.slidePrevClass);

  if (s.params.loop) {
    // Duplicate to all looped slides
    if (nextSlide.classList.contains(s.params.slideDuplicateClass)) {
      childElements = queryChildren(s.wrapper, '.' + s.params.slideClass + ':not(.' + s.params.slideDuplicateClass + ')[data-swiper-slide-index="' + nextSlide.getAttribute('data-swiper-slide-index') + '"]');
    } else {
      childElements = queryChildren(s.wrapper, '.' + s.params.slideClass + '.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + nextSlide.getAttribute('data-swiper-slide-index') + '"]');
    }
    addClass(childElements, s.params.slideDuplicateNextClass);

    if (prevSlide.classList.contains(s.params.slideDuplicateClass)) {
      childElements = queryChildren(s.wrapper, '.' + s.params.slideClass + ':not(.' + s.params.slideDuplicateClass + ')[data-swiper-slide-index="' + prevSlide.getAttribute('data-swiper-slide-index') + '"]');
    } else {
      childElements = queryChildren(s.wrapper, '.' + s.params.slideClass + '.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + prevSlide.getAttribute('data-swiper-slide-index') + '"]');
    }
    addClass(childElements, s.params.slideDuplicatePrevClass);
  }

  // Pagination
  if (s.paginationContainer) {
    // Current/Total
    var current,
      total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
    if (s.params.loop) {
      current = Math.ceil((s.activeIndex - s.loopedSlides) / s.params.slidesPerGroup);
      if (current > s.slides.length - 1 - s.loopedSlides * 2) {
        current = current - (s.slides.length - s.loopedSlides * 2);
      }
      if (current > total - 1) {
        current = current - total;
      }
      if (current < 0 && s.params.paginationType !== 'bullets') {
        current = total + current;
      }

    } else {
      if (typeof s.snapIndex !== 'undefined') {
        current = s.snapIndex;
      } else {
        current = s.activeIndex || 0;
      }
    }

    // Types
    if (s.params.paginationType === 'bullets' && s.bullets && s.bullets.length) {
      for (var i = 0; i < s.bullets.length; i++) {
        if (i === current) {
          addClass(s.bullets[i], s.params.bulletActiveClass);
        } else {
          removeClass(s.bullets[i], s.params.bulletActiveClass);
        }
      }
    }

    if (s.params.paginationType === 'fraction') {
      eachChild(s.paginationContainer, '.' + s.params.paginationCurrentClass, ele => {
        ele.textContent = current + 1;
      });
      eachChild(s.paginationContainer, '.' + s.params.paginationTotalClass, ele => {
        ele.textContent = total;
      });
    }

    if (s.params.paginationType === 'progress') {
      var scale = (current + 1) / total,
        scaleX = scale,
        scaleY = 1;
      if (!isHorizontal(s)) {
        scaleY = scale;
        scaleX = 1;
      }
      eachChild(s.paginationContainer, '.' + s.params.paginationProgressbarClass, ele => {
        transform(ele, 'translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')');
        transition(ele, s.params.speed);
      });
    }
  }

  // Next/active buttons
  if (!s.params.loop) {
    if (s.params.prevButton && s.prevButton) {
      if (s.isBeginning) {
        s.prevButton.classList.add(s.params.buttonDisabledClass);
        if (s.params.a11y) {
          a11yDisable(s.prevButton);
        }
      } else {
        s.prevButton.classList.remove(s.params.buttonDisabledClass);
        if (s.params.a11y) {
          a11yEnable(s.prevButton);
        }
      }
    }
    if (s.params.nextButton && s.nextButton) {
      if (s.isEnd) {
        s.nextButton.classList.add(s.params.buttonDisabledClass);
        if (s.params.a11y) {
          a11yDisable(s.nextButton);
        }
      } else {
        s.nextButton.classList.remove(s.params.buttonDisabledClass);
        if (s.params.a11y) {
          a11yEnable(s.nextButton);
        }
      }
    }
  }
}
