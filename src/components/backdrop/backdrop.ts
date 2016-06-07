import {Directive, ViewEncapsulation, HostListener, ElementRef, Input} from '@angular/core';
import {isTrueProperty} from '../../util/util';

const DISABLE_SCROLL = 'disable-scroll';

/**
 * @private
 */
@Directive({
  selector: 'ion-backdrop',
  host: {
    'role': 'presentation',
    'tappable': '',
    'disable-activated': ''
  },
})
export class Backdrop {
  private static nuBackDrops: number = 0;

  private static push() {
    if (this.nuBackDrops === 0) {
      console.debug('adding .disable-scroll to body');
      document.body.classList.add(DISABLE_SCROLL);
    } else {
      console.warn('several backdrops on screen? probably a bug');
    }
    this.nuBackDrops++;
  }

  private static pop() {
    if (this.nuBackDrops === 0) {
      console.error('pop requires a push');
      return;
    }
    this.nuBackDrops--;
    if (this.nuBackDrops === 0) {
      console.debug('removing .disable-scroll from body');
      document.body.classList.remove(DISABLE_SCROLL);
    }
  }

  private pushed: boolean = false;
  @Input() disableScroll = true;

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    if (isTrueProperty(this.disableScroll)) {
      Backdrop.push();
      this.pushed = true;
    }
  }

  ngOnDestroy() {
    if (this.pushed) {
      Backdrop.pop();
      this.pushed = false;
    }
  }

}
