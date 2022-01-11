### Inline Popover

```html
<!-- Default -->
<ion-popover is-open="true">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- No Arrow -->
<ion-popover is-open="true" arrow="false">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Use a trigger -->
<ion-button id="trigger-button">Click to open popover</ion-button>
<ion-popover trigger="trigger-button">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Hover over trigger to open -->
<ion-button id="hover-button">Hover to open popover</ion-button>
<ion-popover trigger="hover-button" trigger-action="hover">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Show popover above trigger -->
<ion-button id="side-button">Click to open popover</ion-button>
<ion-popover trigger="side-button" side="top">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Align popover to end of trigger -->
<ion-button id="alignment-button">Click to open popover</ion-button>
<ion-popover trigger="alignment-button" side="top" alignment="end">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Make popover the same size as the trigger -->
<ion-button id="size-button">Click to open popover</ion-button>
<ion-popover trigger="size-button" size="cover">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Make popover show relative to click coordinates rather than trigger -->
<ion-button id="size-button">Click to open popover</ion-button>
<ion-popover trigger="size-button" reference="event">
  <ion-content>Popover Content</ion-content>
</ion-popover>

<!-- Nested Popover -->
<ion-button id="nested-button">Click to open popover</ion-button>
<ion-popover trigger="nested-button" dismiss-on-select="true">
  <ion-content>
    <ion-list>
      <ion-item button="true" detail="false">
        <ion-label>Option 1</ion-label>
      </ion-item>
      <ion-item button="true" detail="false">
        <ion-label>Option 2</ion-label>
      </ion-item>
      <ion-item button="true" detail="true" id="nested-trigger">
        <ion-label>Option 3</ion-label>
      </ion-item>
      
      <ion-popover trigger="nested-trigger" dismiss-on-select="true" side="end">
        <ion-content>
          <ion-item button="true">
            <ion-label>Nested Option</ion-label>
          </ion-item>
        </ion-content>
      </ion-popover>
    </ion-list>
  </ion-content>
</ion-popover>
```

### Using JavaScript

```javascript
class PopoverExamplePage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <ion-content>
        <ion-list>
          <ion-list-header><ion-label>Ionic</ion-label></ion-list-header>
          <ion-item button><ion-label>Item 0</ion-label></ion-item>
          <ion-item button><ion-label>Item 1</ion-label></ion-item>
          <ion-item button><ion-label>Item 2</ion-label></ion-item>
          <ion-item button><ion-label>Item 3</ion-label></ion-item>
        </ion-list>
      </ion-content>
    `;
  }
}

customElements.define('popover-example-page', PopoverExamplePage);

async function presentPopover(ev) {
  const popover = Object.assign(document.createElement('ion-popover'), {
    component: 'popover-example-page',
    cssClass: 'my-custom-class',
    event: ev,
    translucent: true
  });
  document.body.appendChild(popover);

  await popover.present();

  const { role } = await popover.onDidDismiss();
  console.log('onDidDismiss resolved with role', role);
}
```
