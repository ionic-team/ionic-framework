import {Directive, ElementRef, Host, Optional} from 'angular2/angular2';
import {Content} from '../content/content';
import {throttle} from '../../util/util';
import {position, offset, CSS, raf} from '../../util/dom';
import {FeatureDetect} from '../../util/feature-detect';
import {Config} from '../../config/config';

/**
 * TODO
 */
@Directive({
  selector: 'ion-item-group',
  host: {
    'class': 'item-group'
  }
})
export class ItemGroup {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(elementRef: ElementRef) {
    this.ele = elementRef.nativeElement;
  }
}

/**
 * TODO
 */
@Directive({
  selector: 'ion-item-group-title',
  host: {
    'class': 'item-group-title',
    '[class.sticky]': 'isSticky'
  }
})
export class ItemGroupTitle {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   */
  constructor(elementRef: ElementRef, config: Config, content: Content, featureDetect: FeatureDetect) {
    this.isSticky = true;
    this.content = content;
    this.ele = elementRef.nativeElement;
    this.parent = this.ele.parentNode;
    this.isCssValid = featureDetect.has('positionsticky')
  }

  onInit() {
    if (!this.content || this.isCssValid) { return; }

    this.scrollContent = this.content.elementRef.nativeElement.children[0];

    this.scrollMin = 0;
    this.scrollMax = 0;
    this.scrollTransition = 0;
    this.isSticking = false;

    this.scrollContent.addEventListener('scroll', event => this.scrollEvent(event));

    this.calculateScrollLimits = scrollTop => {
      var containerPosition = position(this.parent);
      var elementOffset = offset(this.ele);

      var containerTop = containerPosition.top;
      var containerHeight = containerPosition.height;

      var affixHeight = elementOffset.height;

      this.scrollMin = containerTop;
      this.scrollMax = this.scrollMin + containerHeight;
      this.scrollTransition = this.scrollMax - affixHeight;
    };

    // throttled version of the same calculation
    let CALCULATION_THROTTLE_MS = 500;
    this.throttledCalculateScrollLimits = throttle(
      this.calculateScrollLimits,
      CALCULATION_THROTTLE_MS,
      {trailing: false}
    );
  }

  applyTransform(element, transformString) {
   // do not apply the transformation if it is already applied
   if (element.style[CSS.transform] == transformString) {
   }
   else {
     element.style[CSS.transform] = transformString;
   }
  }

  translateUp(element, dy, executeImmediately) {
    var translateDyPixelsUp = dy == 0 ? 'translate3d(0px, 0px, 0px)' : 'translate3d(0px, -' + dy + 'px, 0px)';
    // if immediate execution is requested, then just execute immediately
    // if not, execute in the animation frame.
    if (executeImmediately) {
      this.applyTransform(element, translateDyPixelsUp);
    }
    else {
      raf( a => this.applyTransform(element, translateDyPixelsUp) );
    }
  }

  createAffixClone() {
    var clone = this.ele.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.top = 0;
    clone.style.left = 0;
    clone.style.right = 0;

    this.scrollContent.parentNode.appendChild(clone);
    return clone;
  }

  scrollEvent(event) {
    var scrollTop = event.target.scrollTop;

    // when scroll to top, we should always execute the immediate calculation.
    // this is because of some weird problem which is hard to describe.
    // if you want to experiment, always use the throttled one and just click on the page
    // you will see all affix elements stacked on top
    if (scrollTop == 0) {
      this.calculateScrollLimits(scrollTop);
    }
    else {
      this.throttledCalculateScrollLimits(scrollTop);
    }

    // when we scrolled to the container, create the clone of element and place it on top
    if (scrollTop >= this.scrollMin && scrollTop <= this.scrollMax) {
      // we need to track if we created the clone just now
      // that is important since normally we apply the transforms in the animation frame
      // but, we need to apply the transform immediately when we add the element for the first time. otherwise it is too late!
      var cloneCreatedJustNow = false;

      if (!this.affixClone) {
        this.affixClone = this.createAffixClone();
        cloneCreatedJustNow = true;
        this.isSticking = true;
      }

      // if we're reaching towards the end of the container, apply some nice translation to move up/down the clone
      // but if we're reached already to the container and we're far away than the end, move clone to top
      if (scrollTop > this.scrollTransition) {
        this.translateUp(this.affixClone, Math.floor(scrollTop - this.scrollTransition), cloneCreatedJustNow);
      } else {
        this.translateUp(this.affixClone, 0, cloneCreatedJustNow);
      }
    } else {
      this.removeAffixClone();
      this.isSticking = false;
    }
  }

  removeAffixClone() {
    if (this.affixClone) {
      this.scrollContent.parentNode.removeChild(this.affixClone);
      this.affixClone = null;
    }
  }
}
