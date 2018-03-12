import { Component } from '@angular/core';

@Component({
  templateUrl: 'page-one.html',
  styles: ['page-one.scss']
})
export class PageOne {
  public value: number = 40;
  public buffer: number = 60;
}
