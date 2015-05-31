import {NgFor, DynamicComponentLoader, Injector, DomRenderer, ElementRef} from 'angular2/angular2';
import {Ancestor} from 'angular2/src/core/annotations_impl/visibility';
import {Component, Directive} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';
import {FormBuilder, Validators, formDirectives, ControlGroup} from 'angular2/forms';

import {Segment, SegmentButton, List, Item, ActionMenu, Modal, ModalRef,
  NavbarTemplate, Navbar, NavController, Button, Content} from 'ionic/ionic';

console.log('imporrted', formDirectives, Segment, SegmentButton);

@Component({
  selector: 'ion-view'
})
@View({
  template: `
  <ion-navbar *navbar><ion-title>Cards</ion-title></ion-navbar>

  <ion-content class="padding">
    <h2>Segment</h2>
    <p>
      A segment is a radio-style filter bar to let the user toggle between
      multiple, exclusive options.
    </p>
    <p>
      Segments are useful for quick filtering, like switching the
      the map display between street, hybrid, and satellite.
    </p>

    <form (^submit)="doSubmit($event)" [control-group]="form">

      <ion-segment control="mapStyle">
        <ion-segment-button value="standard" ion-button>
          Standard
        </ion-segment-button>
        <ion-segment-button value="hybrid" ion-button>
          Hybrid
        </ion-segment-button>
        <ion-segment-button value="sat" ion-button>
          Satellite
        </ion-segment-button>
        <!--
        <button ion-button class="active" [segment-value]="standard">
          Standard
        </button>

        <button ion-button [segment-value]="hybrid">
          Hybrid
        </button>

        <button #sat ion-button [segment-value]="sat">
          Satellite
        </button>
      -->

      </ion-segment>
      <button type="submit" button primary>Submit</button>
    </form>

    Map mode: <b>{{form.controls.mapStyle.value}}</b>

    <div [switch]="form.controls.mapStyle.value">
      <div *switch-when="'standard'">
        <h2>Standard</h2>
      </div>
      <div *switch-when="'hybrid'">
        <h2>Hybrid</h2>
      </div>
      <div *switch-when="'sat'">
        <h2>Satellite!!</h2>
      </div>
    </div>
  </ion-content>
  `,
  directives: [NavbarTemplate, Navbar, Content, List, Item, Button, Segment, SegmentButton, formDirectives]
})
export class SegmentPage {
  constructor() {
    var fb = new FormBuilder();
    this.form = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });

  }
}
