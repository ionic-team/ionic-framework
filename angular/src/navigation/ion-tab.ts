import { Directive, ElementRef, Input, OnInit } from '@angular/core';


@Directive({
  selector: 'ion-tab'
})
export class Tab implements OnInit {

  @Input() tabLink: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    console.log('routerLink', this.tabLink, this.elementRef.nativeElement);
  }

}
