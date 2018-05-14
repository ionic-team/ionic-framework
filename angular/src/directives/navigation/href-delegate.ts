import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: 'ion-anchor,ion-button,ion-item'
})
export class HrefDelegate {

  @Input()
  set routerLink(_: any) {
    this.elementRef.nativeElement.button = true;
  }

  @Input()
  set href(value: string) {
    this.elementRef.nativeElement.href = value;
  }
  get href() {
    return this.elementRef.nativeElement.href;
  }

  constructor(
    @Optional() private router: Router,
    private elementRef: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    const url = this.href;
    if (this.router && url != null && url[0] !== '#' && url.indexOf('://') === -1) {
      ev.preventDefault();
      this.router.navigateByUrl(url);
    }
  }
}
