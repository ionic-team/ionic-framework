import { Component, Input } from '@angular/core';

@Component({
  selector: '<my-img>',
  template: '<ion-img [width]="width" [height]="height" [src]="src"></ion-img>'
})
export class MyImg {
  @Input() width: any;
  @Input() height: any;
  @Input() src: any;
}
