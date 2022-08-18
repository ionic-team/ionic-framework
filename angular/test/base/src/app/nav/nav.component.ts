import { Component } from '@angular/core';
import { ModalExampleComponent } from '../modal-example/modal-example.component';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
})
export class NavComponent {
  rootPage = ModalExampleComponent;
  rootParams: any;

  constructor(
    params: NavParams
  ) {
    this.rootParams = {
      ...params.data
    };
  }
}
