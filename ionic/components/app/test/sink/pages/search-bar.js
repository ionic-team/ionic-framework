import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {FormBuilder, Validators, FormDirectives, ControlGroup} from 'angular2/forms';

import {Segment, SegmentButton, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Cards</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Search Bar</h2>
    <p>
      The Search Bar is a multi-function search component.
    </p>
    <p>
      The bar can sit standalone as part of a form or header search,
      or it can also handle and display a list of search results.
    </p>

    <form (^submit)="doSubmit($event)" [control-group]="form">
    </form>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item, Segment, SegmentButton]
})
export class SegmentPage {
  constructor() {
    var fb = new FormBuilder();
    this.form = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });

  }
}
