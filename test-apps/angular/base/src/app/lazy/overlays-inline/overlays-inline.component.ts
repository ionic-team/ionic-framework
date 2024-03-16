import { Component } from "@angular/core";

/**
 * Validates that inline overlays will will display correctly.
 */
@Component({
  selector: 'app-overlays-inline',
  templateUrl: 'overlays-inline.component.html'
})
export class OverlaysInlineComponent {
  public pickerButtons = [{ text: 'Ok' }, { text: 'Cancel', role: 'cancel' }];
  public pickerColumns = [
    {
      name: 'Colors',
      options: [
        {
          text: 'Red',
          value: 'red',
        },
        {
          text: 'Blue',
          value: 'blue',
        },
        {
          text: 'Green',
          value: 'green',
        },
      ],
    },
  ];
}
