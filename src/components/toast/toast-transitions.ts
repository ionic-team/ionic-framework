import { Animation } from '../../animations/animation';
import { Transition } from '../../transitions/transition';


export class ToastSlideIn extends Transition {
  init() {
    // DOM READS
    let ele = this.enteringView.pageRef().nativeElement;
    const wrapperEle = <HTMLElement> ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(this.plt, wrapperEle);

    if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_TOP) {
      // top
      // by default, it is -100% hidden (above the screen)
      // so move from that to 10px below top: 0px;
      wrapper.fromTo('translateY', '-100%', `${10}px`);

    } else if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just center it and fade it in
      let topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
      // DOM WRITE
      wrapperEle.style.top = `${topPosition}px`;
      wrapper.fromTo('opacity', 0.01, 1);

    } else {
      // bottom
      // by default, it is 100% hidden (below the screen),
      // so move from that to 10 px above bottom: 0px
      wrapper.fromTo('translateY', '100%', `${0 - 10}px`);
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
  }
}


export class ToastSlideOut extends Transition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    const wrapperEle = <HTMLElement> ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(this.plt, wrapperEle);

    if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_TOP) {
      // top
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${10}px`, '-100%');

    } else if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just fade it out
      wrapper.fromTo('opacity', 0.99, 0);

    } else {
      // bottom
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${0 - 10}px`, '100%');
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(wrapper);
  }
}


export class ToastMdSlideIn extends Transition {
  init() {
    // DOM reads
    let ele = this.enteringView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(this.plt, wrapperEle);

    if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_TOP) {
      // top
      // by default, it is -100% hidden (above the screen)
      // so move from that to top: 0px;
      wrapper.fromTo('translateY', '-100%', `0%`);

    } else if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just center it and fade it in
      let topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
      // DOM WRITE
      wrapperEle.style.top = `${topPosition}px`;
      wrapper.fromTo('opacity', 0.01, 1);

    } else {
      // bottom
      // by default, it is 100% hidden (below the screen),
      // so move from that to bottom: 0px
      wrapper.fromTo('translateY', '100%', `0%`);
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
  }
}


export class ToastMdSlideOut extends Transition {
  init() {
    let ele = this.leavingView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(this.plt, wrapperEle);

    if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_TOP) {
      // top
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${0}%`, '-100%');

    } else if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just fade it out
      wrapper.fromTo('opacity', 0.99, 0);

    } else {
      // bottom
      // reverse arguments from enter transition
      wrapper.fromTo('translateY', `${0}%`, '100%');
    }

    this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(wrapper);
  }
}


export class ToastWpPopIn extends Transition {
  init() {
    let ele = this.enteringView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(this.plt, wrapperEle);

    if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_TOP) {
      // top
      wrapper.fromTo('opacity', 0.01, 1);
      wrapper.fromTo('scale', 1.3, 1);

    } else if (this.enteringView.data && this.enteringView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just center it and fade it in
      let topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);

      // DOM WRITE
      wrapperEle.style.top = `${topPosition}px`;
      wrapper.fromTo('opacity', 0.01, 1);
      wrapper.fromTo('scale', 1.3, 1);

    } else {
      // bottom
      wrapper.fromTo('opacity', 0.01, 1);
      wrapper.fromTo('scale', 1.3, 1);
    }

    this.easing('cubic-bezier(0,0,0.05,1)').duration(200).add(wrapper);
  }
}


export class ToastWpPopOut extends Transition {
  init() {
    // DOM reads
    let ele = this.leavingView.pageRef().nativeElement;
    const wrapperEle = ele.querySelector('.toast-wrapper');
    let wrapper = new Animation(this.plt, wrapperEle);

    if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_TOP) {
      // top
      // reverse arguments from enter transition
      wrapper.fromTo('opacity', 0.99, 0);
      wrapper.fromTo('scale', 1, 1.3);

    } else if (this.leavingView.data && this.leavingView.data.position === TOAST_POSITION_MIDDLE) {
      // Middle
      // just fade it out
      wrapper.fromTo('opacity', 0.99, 0);
      wrapper.fromTo('scale', 1, 1.3);

    } else {
      // bottom
      // reverse arguments from enter transition
      wrapper.fromTo('opacity', 0.99, 0);
      wrapper.fromTo('scale', 1, 1.3);
    }

    // DOM writes
    const EASE: string = 'ease-out';
    const DURATION: number = 150;
    this.easing(EASE).duration(DURATION).add(wrapper);
  }
}


const TOAST_POSITION_TOP = 'top';
const TOAST_POSITION_MIDDLE = 'middle';
