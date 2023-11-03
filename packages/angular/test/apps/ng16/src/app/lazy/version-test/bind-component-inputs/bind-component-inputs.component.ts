import { Component, Input, OnInit } from "@angular/core";
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bind-route',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>bindToComponentInputs</ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div>
        <h3>Bind Route</h3>
        <p id="route-params">Route params: id: {{id}}</p>
        <p id="query-params">Query params: query: {{query}}</p>
        <p id="data">Data: title: {{title}}</p>
        <p id="resolve">Resolve: name: {{name}}</p>
      </div>
  </ion-content>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class BindComponentInputsComponent implements OnInit {

  @Input() id?: string; // path parameter
  @Input() query?: string; // query parameter
  @Input() title?: string; // data property
  @Input() name?: string; // resolve property

  ngOnInit(): void {
    console.log('BindComponentInputsComponent.ngOnInit', {
      id: this.id,
      query: this.query,
      title: this.title,
      name: this.name
    });
  }

}
