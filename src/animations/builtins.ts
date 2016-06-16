
import {Animation} from './animation';


class SlideIn extends Animation {
  constructor(element: any) {
    super(element);
    this
      .easing('cubic-bezier(0.1,0.7,0.1,1)')
      .duration(400)
      .fromTo('translateY', '100%', '0%');
  }
}
Animation.register('slide-in', SlideIn);


class SlideOut extends Animation {
  constructor(element: any) {
    super(element);
    this
      .easing('ease-out')
      .duration(250)
      .fromTo('translateY', '0%', '100%');
  }
}
Animation.register('slide-out', SlideOut);


class FadeIn extends Animation {
  constructor(element: any) {
    super(element);
    this
      .easing('ease-in')
      .duration(400)
      .fromTo('opacity', 0.001, 1, true);
  }
}
Animation.register('fade-in', FadeIn);


class FadeOut extends Animation {
  constructor(element: any) {
    super(element);
    this
      .easing('ease-out')
      .duration(250)
      .fromTo('opacity', 0.999, 0);
  }
}
Animation.register('fade-out', FadeOut);
