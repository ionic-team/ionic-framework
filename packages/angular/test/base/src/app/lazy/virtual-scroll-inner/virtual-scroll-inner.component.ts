import { Component, OnInit, Input } from '@angular/core';

import { assertZoneContext } from '../../zone-assert.util';

@Component({
  selector: 'app-virtual-scroll-inner',
  templateUrl: './virtual-scroll-inner.component.html',
})
export class VirtualScrollInnerComponent implements OnInit {

  @Input() value?: string;
  onInit = 0;

  ngOnInit() {
    assertZoneContext();
    this.onInit++;
    console.log('created');
  }
}
