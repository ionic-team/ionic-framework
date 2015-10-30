import {Content} from './content';

export class StickyPolyfill {
  constructor(private content: Content) {
    this._els = [];
  }

  init() {
    let handleScroll = (event) => {
      let t = event.target;
      let top = t.scrollTop;
      console.log(top);

    }

    this._scrollListener = this.content.addScrollEventListener(handleScroll);
  }
  onDestroy() {
    if(this._scrollListener) {
      // Remove the old listener
      this._scrollListener();
    }
  }
  add(element: Element) {
    this._els.push(this.initElement(element))
  }

  remove(element: Element) {
  }

  initElement(element) {
  }
}
