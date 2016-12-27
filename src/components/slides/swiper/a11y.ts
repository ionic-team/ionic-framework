import { Swiper } from './swiper';
// Accessibility tools

function makeFocusable($el) {
  $el.attr('tabIndex', '0');
  return $el;
}

function addRole($el, role) {
  $el.attr('role', role);
  return $el;
}

function addLabel($el, label) {
  $el.attr('aria-label', label);
  return $el;
}

function disable($el) {
  $el.attr('aria-disabled', true);
  return $el;
}

function enable($el) {
  $el.attr('aria-disabled', false);
  return $el;
}

function onEnterKey(event) {
  if (event.keyCode !== 13) return;
  if ($(event.target).is(s.params.nextButton)) {
    s.onClickNext(event);
    if (s.isEnd) {
      s.a11y.notify(s.params.lastSlideMessage);
    } else {
      s.a11y.notify(s.params.nextSlideMessage);
    }
  } else if ($(event.target).is(s.params.prevButton)) {
    s.onClickPrev(event);
    if (s.isBeginning) {
      s.a11y.notify(s.params.firstSlideMessage);
    } else {
      s.a11y.notify(s.params.prevSlideMessage);
    }
  }
  if ($(event.target).is('.' + s.params.bulletClass)) {
    $(event.target)[0].click();
  }
}



function notify(message) {
  var notification = s.a11y.liveRegion;
  if (notification.length === 0) return;
  notification.html('');
  notification.html(message);
}

export function initA11y(s: Swiper) {
  s.liveRegion = $('<span class="' + s.params.notificationClass + '" aria-live="assertive" aria-atomic="true"></span>'),

  // Setup accessibility
  if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
    makeFocusable(s.nextButton);
    addRole(s.nextButton, 'button');
    addLabel(s.nextButton, s.params.nextSlideMessage);
  }
  if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
    makeFocusable(s.prevButton);
    addRole(s.prevButton, 'button');
    addLabel(s.prevButton, s.params.prevSlideMessage);
  }

  $(s.container).append(s.a11y.liveRegion);
}

function initPagination(s: Swiper) {
  if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
    s.bullets.each(function () {
      var bullet = $(this);
      s.a11y.makeFocusable(bullet);
      s.a11y.addRole(bullet, 'button');
      s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
    });
  }
}

function destroyA11y(s: Swiper) {
  if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) {
    s.a11y.liveRegion.remove();
  }
}
