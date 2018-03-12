# ion-avatar

Avatars are circular components that usually wrap an image or icon. They can be used to represent a person or an object.

Avatars can be used by themselves or inside of any element. If placed inside of an `ion-chip` or `ion-item`, the avatar will resize to fit the parent component. To position an avatar on the left or right side of an item, set the slot to `start` or `end`, respectively.

```html
<ion-avatar>
  <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
</ion-avatar>

<ion-chip>
  <ion-avatar>
    <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
  </ion-avatar>
  <ion-label>Chip Avatar</ion-label>
</ion-chip>

<ion-item>
  <ion-avatar slot="start">
    <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y">
  </ion-avatar>
  <ion-label>Item Avatar</ion-label>
</ion-item>
```


<!-- Auto Generated Below -->



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
