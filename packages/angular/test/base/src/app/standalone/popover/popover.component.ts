import { Component } from '@angular/core';
import { IonPopover } from '@ionic/angular/standalone';

@Component({
  selector: 'app-test',
  templateUrl: './popover.component.html',
  standalone: true,
  imports: [IonPopover]
})
export class PopoverComponent {
}
