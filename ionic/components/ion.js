/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
export class Ion {
  constructor(elementRef: ElementRef) {
    console.log('ION INIT', elementRef);
    this.elementRef = elementRef;
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }
}
