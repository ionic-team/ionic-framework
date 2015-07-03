
import {Animation} from './animation';


class SlideIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(0.1,0.7,0.1,1)')
      .duration(400)
      .fromTo('translateY', '100%', '0%');
  }
}
Animation.register('slide-in', SlideIn);


class SlideOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-out')
      .duration(250)
      .fromTo('translateY', '0%', '100%');
  }
}
Animation.register('slide-out', SlideOut);


class FadeIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-in')
      .duration(400)
      .fadeIn();
  }
}
Animation.register('fade-in', FadeIn);


class FadeOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('ease-out')
      .duration(250)
      .fadeOut();
  }
}
Animation.register('fade-out', FadeOut);
