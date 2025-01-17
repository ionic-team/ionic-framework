import { Component, Input, OnInit } from '@angular/core';
import { ModalExampleComponent } from '../modal-example/modal-example.component';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    standalone: false
})
export class NavComponent implements OnInit {
  rootPage = ModalExampleComponent;
  rootParams: any;

  @Input() value?: string;
  @Input() prop?: string;

  ngOnInit() {
    this.rootParams = {
      value: this.value,
      prop: this.prop
    };
  }
}
