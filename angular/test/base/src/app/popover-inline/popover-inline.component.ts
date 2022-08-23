import { Component } from "@angular/core";

/**
 * Validates that inline popovers will correctly display
 * dynamic contents that are updated after the modal is
 * display.
 */
@Component({
  selector: 'app-popover-inline',
  templateUrl: 'popover-inline.component.html'
})
export class PopoverInlineComponent {

  items: string[] = [];

  openPopover(popover: HTMLIonPopoverElement) {
    popover.present();

    setTimeout(() => {
      this.items = ['A', 'B', 'C', 'D'];
    }, 1000);
  }

}
