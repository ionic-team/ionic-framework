import {NavController} from './nav-controller';
import {SlideEdgeGesture} from '../../gestures/slide-edge-gesture';


export class SwipeBackGesture extends SlideEdgeGesture {
  public edges: Array<string>;
  public threshold: string;

  constructor(
    element: HTMLElement, 
    opts: any = {}, 
    private _nav: NavController
  ) {
    super(element, opts);
    
    // Can check corners through use of eg 'left top'
    this.edges = opts.edge.split(' ');
    this.threshold = opts.threshold;
  }

  onSlideStart() {
    this._nav.swipeBackStart();
  }

  onSlide(slide, ev) {
    this._nav.swipeBackProgress(slide.distance / slide.max);
  }

  onSlideEnd(slide, ev) {
    let shouldComplete = (Math.abs(ev.velocityX) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);

    // TODO: calculate a better playback rate depending on velocity and distance
    this._nav.swipeBackEnd(shouldComplete, 1);
  }

}
