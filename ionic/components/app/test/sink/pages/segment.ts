import {FormBuilder, Validators, formDirectives, Control, ControlGroup} from 'angular2/angular2';

import {IonicView} from 'ionic/ionic';


@IonicView({
  template: `
  <ion-navbar *navbar><ion-title>Segment</ion-title></ion-navbar>

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

    <form (^submit)="doSubmit($event)">

      <div ng-control-group="form">
        <ion-segment [ng-form-control]="mapStyle">
          <ion-segment-button value="standard" button>
            Standard
          </ion-segment-button>
          <ion-segment-button value="hybrid" button>
            Hybrid
          </ion-segment-button>
          <ion-segment-button value="sat" button>
            Satellite
          </ion-segment-button>
        </ion-segment>
      </div>
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
  `
})
export class SegmentPage {
  constructor() {
    /*
    var fb = new FormBuilder();
    this.form = fb.group({
      mapStyle: ['hybrid', Validators.required]
    });
    */

    this.mapStyle = new Control("hybrid", Validators.required);
    this.form = new ControlGroup({
      "mapStyle": this.mapStyle
    });

  }
}
