```html
<template>
  <ion-content>
    <ion-list>
      <ion-reorder-group>

        <ion-item>
          <ion-label>
            Item 1
          </ion-label>
          <ion-reorder slot="end"></ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 2 (default ion-reorder slot="start")
          </ion-label>
          <ion-reorder slot="start"></ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 3 (custom ion-reorder)
          </ion-label>
          <ion-reorder slot="end">
            <ion-icon name="pizza"></ion-icon>
          </ion-reorder>
        </ion-item>

        <ion-item>
          <ion-label>
            Item 4 (custom ion-reorder slot="start")
          </ion-label>
          <ion-reorder slot="start">
            <ion-icon name="pizza"></ion-icon>
          </ion-reorder>
        </ion-item>

        <ion-reorder>
          <ion-item>
            <ion-label>
              Item 5 (the whole item can be dragged)
            </ion-label>
            </ion-item>
        </ion-reorder>

      </ion-reorder-group>
    </ion-list>
  </ion-content>
</template>
```
