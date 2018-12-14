import { Component, OnInit, NgZone, Input } from '@angular/core';

@Component({
  selector: 'app-virtual-scroll-inner',
  templateUrl: './virtual-scroll-inner.component.html',
})
export class VirtualScrollInnerComponent implements OnInit {

  @Input() value: string;
  onInit = 0;

  ngOnInit() {
    NgZone.assertInAngularZone();
    this.onInit++;
    console.log('created');
  }
}
