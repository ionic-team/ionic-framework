import { Directive, ElementRef, HostListener, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavIntent } from '../../providers/nav-controller';

export type RouterDirection =  'forward' | 'back' | 'root' | 'auto';

@Directive({
  selector: '[routerDirection],ion-anchor,ion-button,ion-item'
})
export class HrefDelegate {

  @Input() routerDirection: RouterDirection = 'forward';

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
    private navCtrl: NavController,
    private elementRef: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  onClick(ev: Event) {
    const url = this.href;
    if (this.router && url != null && url[0] !== '#' && url.indexOf('://') === -1) {
      ev.preventDefault();
      this.navCtrl.setIntent(textToIntent(this.routerDirection));
      this.router.navigateByUrl(url);
    }
  }
}

function textToIntent(direction: RouterDirection) {
  switch (direction) {
    case 'forward': return NavIntent.Forward;
    case 'back': return NavIntent.Back;
    case 'root': return NavIntent.Root;
    default: return NavIntent.Auto;
  }
}
