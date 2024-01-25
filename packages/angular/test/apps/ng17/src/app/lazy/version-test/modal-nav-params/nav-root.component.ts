import { JsonPipe } from "@angular/common";
import { Component, Input } from "@angular/core";

import { IonicModule } from "@ionic/angular";

/**
 * This is used to track if any occurences of
 * the ion-nav root component being attached to
 * the DOM result in the rootParams not being
 * assigned to the component instance.
 *
 * https://github.com/ionic-team/ionic-framework/issues/27146
 */
let rootParamsException = false;

@Component({
  selector: 'app-modal-content',
  template: `
    {{ hasException ? 'ERROR' : 'OK' }}
  `,
  standalone: true,
  imports: [IonicModule, JsonPipe]
})
export class NavRootComponent {

  @Input() params: any;

  ngOnInit() {
    if (this.params === undefined) {
      rootParamsException = true;
    }
  }

  get hasException() {
    return rootParamsException;
  }

}
