```html
<ion-content
  [scrollEvents]="true"
  (ionScrollStart)="logScrollStart()"
  (ionScroll)="logScrolling($event)"
  (ionScrollEnd)="logScrollEnd()">
    <h1>Main Content</h1>

    <div slot="fixed">
      <h1>Fixed Content</h1>
    </div>
</ion-content>
```

