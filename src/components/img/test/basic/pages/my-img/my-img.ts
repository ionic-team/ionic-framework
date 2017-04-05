import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-img',
  template: `<ion-img [width]="width" [height]="height" [src]="src"></ion-img>`
})
export class MyImg {
  @Input() public width: number;
  @Input() public height: number;
  @Input() public src: string;
}
