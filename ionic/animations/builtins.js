
import {Animation} from './animation';


class SlideIn extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('cubic-bezier(0.1, 0.7, 0.1, 1)')
      .duration(400)
      .from('translateY', '100%')
      .to('translateY', '0%');
  }
}

Animation.register('slide-in', SlideIn);

class SlideOut extends Animation {
  constructor(element) {
    super(element);
    this
      .easing('easeInOut')
      .duration(250)
      .from('translateY', '0%')
      .to('translateY', '100%');
  }
}

Animation.register('slide-out', SlideOut);
