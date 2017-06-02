import { Component } from '@angular/core';
import {ComponentsPage} from '../pages/components/components';
import {AssistiveTouchProvider} from "../providers/assistive-touch/assistive-touch";

@Component({
  template: `<assistive-touch></assistive-touch>
    <ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root = ComponentsPage;
}
