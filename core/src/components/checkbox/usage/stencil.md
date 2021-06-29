```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'checkbox-example',
  styleUrl: 'checkbox-example.css'
})
export class CheckboxExample {
  private form = [
    { val: 'Pepperoni', isChecked: true },
    { val: 'Sausage', isChecked: false },
    { val: 'Mushroom', isChecked: false }
  ];

  render() {
    return [
      // Default Checkbox
      <ion-checkbox></ion-checkbox>,

      // Disabled Checkbox
      <ion-checkbox disabled={true}></ion-checkbox>,

      // Checked Checkbox
      <ion-checkbox checked={true}></ion-checkbox>,

      // Checkbox Colors
      <ion-checkbox color="primary"></ion-checkbox>,
      <ion-checkbox color="secondary"></ion-checkbox>,
      <ion-checkbox color="danger"></ion-checkbox>,
      <ion-checkbox color="light"></ion-checkbox>,
      <ion-checkbox color="dark"></ion-checkbox>,

      // Checkboxes in a List
      <ion-list>
        {this.form.map(entry =>
          <ion-item>
            <ion-label>{entry.val}</ion-label>
            <ion-checkbox slot="end" checked={entry.isChecked}></ion-checkbox>
          </ion-item>
        )}
      </ion-list>
    ];
  }
}
```
