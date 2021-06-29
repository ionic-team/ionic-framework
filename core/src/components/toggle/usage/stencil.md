```tsx
import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'toggle-example',
  styleUrl: 'toggle-example.css'
})
export class ToggleExample {
  @State() pepperoni: boolean = false;
  @State() sausage: boolean = true;
  @State() mushrooms: boolean = false;

  render() {
    return [
      // Default Toggle
      <ion-toggle></ion-toggle>,

      // Disabled Toggle
      <ion-toggle disabled></ion-toggle>,

      // Checked Toggle
      <ion-toggle checked></ion-toggle>,

      // Toggle Colors
      <ion-toggle color="primary"></ion-toggle>,
      <ion-toggle color="secondary"></ion-toggle>,
      <ion-toggle color="danger"></ion-toggle>,
      <ion-toggle color="light"></ion-toggle>,
      <ion-toggle color="dark"></ion-toggle>,

      // Toggles in a List
      <ion-list>
        <ion-item>
          <ion-label>Pepperoni</ion-label>
          <ion-toggle checked={this.pepperoni} onIonChange={(ev) => this.pepperoni = ev.detail.checked}></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>Sausage</ion-label>
          <ion-toggle checked={this.sausage} onIonChange={(ev) => this.sausage = ev.detail.checked} disabled={true}></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>Mushrooms</ion-label>
          <ion-toggle checked={this.mushrooms} onIonChange={(ev) => this.mushrooms = ev.detail.checked}></ion-toggle>
        </ion-item>
      </ion-list>,

      <div>
        Pepperoni: {this.pepperoni ? "true" : "false"}<br/>
        Sausage: {this.sausage ? "true" : "false"}<br/>
        Mushrooms: {this.mushrooms ? "true" : "false"}
      </div>
    ];
  }
}
```
