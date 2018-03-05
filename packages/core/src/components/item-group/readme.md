# ion-item-group

Item groups are containers that organize similar items together. They can contain item dividers to divide the items into multiple sections.

```html
<ion-item-group>
  <ion-item-divider>A</ion-item-divider>

  <ion-item>
    <ion-label>Angola</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Argentina</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Armenia</ion-label>
  </ion-item>
</ion-item-group>

<ion-item-group>
  <ion-item-divider>B</ion-item-divider>

  <ion-item>
    <ion-label>Bangladesh</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Belarus</ion-label>
  </ion-item>
  <ion-item>
    <ion-label>Belgium</ion-label>
  </ion-item>
</ion-item-group>
```

They can also be used to group sliding items:

```html
<ion-item-group>
  <ion-item-divider>
    Fruits
  </ion-item-divider>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Grapes</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Apples</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-item-group>

<ion-item-group>
  <ion-item-divider>
    Vegetables
  </ion-item-divider>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Carrots</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>

  <ion-item-sliding>
    <ion-item>
      <ion-label>
        <h3>Celery</h3>
      </ion-label>
    </ion-item>
    <ion-item-options>
      <ion-item-option>
        Favorite
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</ion-item-group>
```

<!-- Auto Generated Below -->



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
