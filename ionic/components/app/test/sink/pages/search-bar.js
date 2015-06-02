import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {Segment, SegmentButton, SearchBar, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

  console.log(NavbarTemplate, Navbar, Content, formDirectives);

@Component({
  selector: 'ion-view',
  appInjector: [FormBuilder]
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Search Bar</ion-title></ion-navbar>

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
      <ion-search-bar placeholder="Search" control="searchQuery"></ion-search-bar>
      <div>
        Query: <b>{{form.controls.searchQuery.value}}</b>
      </div>
    </form>
  </ion-content>
  `,
  directives: [formDirectives, NavbarTemplate, Navbar, Content, SearchBar]
})
export class SearchBarPage {
  constructor(formBuilder: FormBuilder) {
    //var fb = new FormBuilder();
    this.form = formBuilder.group({
      searchQuery: ['', Validators.required]
    });
  }
}
