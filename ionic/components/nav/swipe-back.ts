import {SlideEdgeGesture} from 'ionic/gestures/slide-edge-gesture';


export class SwipeBackGesture extends SlideEdgeGesture {

  constructor(element: Element, opts: Object = {}, navCtrl) {
    super(element, opts);
    // Can check corners through use of eg 'left top'
    this.edges = opts.edge.split(' ');
    this.threshold = opts.threshold;
    this.navCtrl = navCtrl;
  }

  onSlideStart() {
    this.navCtrl.swipeBackStart();
  }

  onSlide(slide, ev) {
    this.navCtrl.swipeBackProgress(slide.distance / slide.max);
  }

  onSlideEnd(slide, ev) {
    let shouldComplete = (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);

    // TODO: calculate a better playback rate depending on velocity and distance
    this.navCtrl.swipeBackEnd(shouldComplete, 1);
  }

}
