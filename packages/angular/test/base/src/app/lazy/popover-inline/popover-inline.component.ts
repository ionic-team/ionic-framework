import { Component } from "@angular/core";

import { IonPopover } from "@ionic/angular";

/**
 * Validates that inline popovers will correctly display
 * dynamic contents that are updated after the modal is
 * display.
 */
@Component({
  selector: 'app-popover-inline',
  templateUrl: 'popover-inline.component.html',
  standalone: false
})
export class PopoverInlineComponent {

  items: {text: string, disabled?: boolean}[] = [];

  openPopover(popover: IonPopover) {
    popover.present();

    setTimeout(() => {
      this.items = [{text: 'A'}, {text: 'B'}, {text: 'C', disabled: true}, {text: 'D'}];
    }, 1000);
  }

}
