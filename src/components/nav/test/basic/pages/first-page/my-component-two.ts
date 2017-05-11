import { Component } from '@angular/core';

@Component({
  selector: 'my-cmp2',
  template: `<span style="color:green">{{value}}</span>`
})
export class MyCmpTest2 {
  value: string = 'Test Failed';
}
