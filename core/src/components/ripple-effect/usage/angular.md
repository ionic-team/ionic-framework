```html
<ion-app>
  <ion-content>
    <div class="ion-activatable ripple-parent">
      A plain div with a bounded ripple effect
      <ion-ripple-effect></ion-ripple-effect>
    </div>

    <button class="ion-activatable ripple-parent">
      A button with a bounded ripple effect
      <ion-ripple-effect></ion-ripple-effect>
    </button>

    <div class="ion-activatable ripple-parent">
      A plain div with an unbounded ripple effect
      <ion-ripple-effect type="unbounded"></ion-ripple-effect>
    </div>

    <button class="ion-activatable ripple-parent">
      A button with an unbounded ripple effect
      <ion-ripple-effect type="unbounded"></ion-ripple-effect>
    </button>
  </ion-content>
</ion-app>
```

```css
.ripple-parent {
  position: relative;
  overflow: hidden;
}
```