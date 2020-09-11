# ion-title

`ion-title` is a component that sets the title of the `Toolbar`.

<!-- Auto Generated Below -->


## Usage

### Angular / javascript

```html
<!-- Default title -->
<ion-toolbar>
  <ion-title>Default Title</ion-title>
</ion-toolbar>

<!-- Small title above a default title -->
<ion-toolbar>
  <ion-title size="small">Small Title above a Default Title</ion-title>
</ion-toolbar>
<ion-toolbar>
  <ion-title>Default Title</ion-title>
</ion-toolbar>

<!-- Large title -->
<ion-toolbar>
  <ion-title size="large">Large Title</ion-title>
</ion-toolbar>
```

### Collapsible Large Titles

Ionic provides a way to create the collapsible titles that exist on stock iOS apps. Getting this setup requires configuring your `ion-title`, `ion-header`, and (optionally) `ion-buttons` elements.

```html
<ion-header translucent="true">
  <ion-toolbar>
    <ion-title>Settings</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Settings</ion-title>
    </ion-toolbar>
    <ion-toolbar>
      <ion-searchbar></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  ...

</ion-content>
```

In the example above, notice there are two `ion-header` elements. The first `ion-header` represents the "collapsed" state of your collapsible header, and the second `ion-header` represents the "expanded" state of your collapsible header. Notice that the second `ion-header` must have `collapse="condense"` and must exist within `ion-content`. Additionally, in order to get the large title styling, `ion-title` must have `size="large"`.

```html
<ion-header translucent="true">
  <ion-toolbar>
    <ion-buttons collapse="true" slot="end">
      <ion-button>Click Me</ion-button>
    </ion-buttons>
    <ion-title>Settings</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content fullscreen="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-buttons collapse="true" slot="end">
        <ion-button>Click Me</ion-button>
      </ion-buttons>
      <ion-title size="large">Settings</ion-title>
    </ion-toolbar>
    <ion-toolbar>
      <ion-searchbar></ion-searchbar>
    </ion-toolbar>
  </ion-header>

  ...

</ion-content>
```

In this example, notice that we have added two sets of `ion-buttons` both with `collapse` set to `true`. When the secondary header collapses, the buttons in the secondary header will hide, and the buttons in the primary header will show. This is useful for ensuring that your header buttons always appear next to an `ion-title` element.

`ion-buttons` elements that do not have `collapse` set will always be visible, regardless of collapsed state. When using the large title and `ion-buttons` elements inside of `ion-content`, the `ion-buttons` elements should always be placed in the `end` slot.

> When using collapsible large titles, it is required that `fullscreen` is set to `true` on `ion-content` and `translucent` is set to `true` on the main `ion-header`.

### Styling Collapsible Large Titles

The collapsible large title should appear seamless in relation to the rest of your content. This means that the background color of the `ion-toolbar` that contains the collapsible large title should always match the background color of `ion-content`. 

By default, the `ion-toolbar` that contains the standard title is hidden using `opacity: 0` and is progressively shown as you collapse the large title by scrolling. As a result, the background color that you see behind the standard title is actually the background color of `ion-content`.

You can change the background color of the toolbar with the standard title by setting the `--background` CSS variable on `ion-toolbar`. This will give the effect of the header changing color as you collapse the large title.

When styling the text color of the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

```css
ion-title.large-title {
  color: purple;
  font-size: 30px;
}
```


### React

```tsx
import React from 'react';
import {
  IonTitle,
  IonToolbar
} from '@ionic/react';

export const ToolbarExample: React.FC = () => (
  {/*-- Default title --*/}
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  {/*-- Small title --*/}
  <IonToolbar>
    <IonTitle size="small">Small Title above a Default Title</IonTitle>
  </IonToolbar>
  <IonToolbar>
    <IonTitle>Default Title</IonTitle>
  </IonToolbar>

  {/*-- Large title --*/}
  <IonToolbar>
    <IonTitle size="large">Large Title</IonTitle>
  </IonToolbar>
);
```

### Collapsible Large Titles

Ionic provides a way to create the collapsible titles that exist on stock iOS apps. Getting this setup requires configuring your `IonTitle`, `IonHeader`, and (optionally) `IonButtons` elements.

```tsx
import React from 'react';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/react';

export const LargeTitleExample: React.FC = () => (
  <>
    <IonHeader translucent="true">
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen="true">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Settings</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      ...

    </IonContent>
  </>
);
```

In the example above, notice there are two `IonHeader` elements. The first `IonHeader` represents the "collapsed" state of your collapsible header, and the second `IonHeader` represents the "expanded" state of your collapsible header. Notice that the second `IonHeader` must have `collapse="condense"` and must exist within `IonContent`. Additionally, in order to get the large title styling, `IonTitle` must have `size="large"`.

```tsx
import React from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/react';

export const LargeTitleExample: React.FC = () => (
  <>
    <IonHeader translucent="true">
      <IonToolbar>
        <IonButtons collapse="true" slot="end">
          <IonButton>Click Me</IonButton>
        </IonButtons>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent fullscreen="true">
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonButtons collapse="true" slot="end">
            <IonButton>Click Me</IonButton>
          </IonButtons>
          <IonTitle size="large">Settings</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      ...

    </IonContent>
  </>
);
```

In this example, notice that we have added two sets of `IonButtons` both with `collapse` set to `true`. When the secondary header collapses, the buttons in the secondary header will hide, and the buttons in the primary header will show. This is useful for ensuring that your header buttons always appear next to an `IonTitle` element.

`IonButtons` elements that do not have `collapse` set will always be visible, regardless of collapsed state. When using the large title and `ion-buttons` elements inside of `ion-content`, the `ion-buttons` elements should always be placed in the `end` slot.

> When using collapsible large titles, it is required that `fullscreen` is set to `true` on `IonContent` and `translucent="true"` be set on the main `IonHeader`.

### Styling Collapsible Large Titles

The collapsible large title should appear seamless in relation to the rest of your content. This means that the background color of the `IonToolbar` that contains the collapsible large title should always match the background color of `IonContent`. 

By default, the `IonToolbar` that contains the standard title is hidden using `opacity: 0` and is progressively shown as you collapse the large title by scrolling. As a result, the background color that you see behind the standard title is actually the background color of `IonContent`.

You can change the background color of the toolbar with the standard title by setting the `--background` CSS variable on `IonToolbar`. This will give the effect of the header changing color as you collapse the large title.

When styling the text color of the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

```css
ion-title.large-title {
  color: purple;
  font-size: 30px;
}
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'title-example',
  styleUrl: 'title-example.css'
})
export class TitleExample {
  render() {
    return [
      // Default title
      <ion-toolbar>
        <ion-title>Default Title</ion-title>
      </ion-toolbar>,

      // Small title above a default title
      <ion-toolbar>
        <ion-title size="small">Small Title above a Default Title</ion-title>
      </ion-toolbar>,
      <ion-toolbar>
        <ion-title>Default Title</ion-title>
      </ion-toolbar>,

      // Large title
      <ion-toolbar>
        <ion-title size="large">Large Title</ion-title>
      </ion-toolbar>
    ];
  }
}
```


### Collapsible Large Titles

Ionic provides a way to create the collapsible titles that exist on stock iOS apps. Getting this setup requires configuring your `ion-title`, `ion-header`, and (optionally) `ion-buttons` elements.

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'title-example',
  styleUrl: 'title-example.css'
})
export class TitleExample {
  render() {
    return [
      <ion-header translucent={true}>
        <ion-toolbar>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content fullscreen={true}>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Settings</ion-title>
          </ion-toolbar>
          <ion-toolbar>
            <ion-searchbar></ion-searchbar>
          </ion-toolbar>
        </ion-header>

        ...

      </ion-content>
    ];
  }
}
```

In the example above, notice there are two `ion-header` elements. The first `ion-header` represents the "collapsed" state of your collapsible header, and the second `ion-header` represents the "expanded" state of your collapsible header. Notice that the second `ion-header` must have `collapse="condense"` and must exist within `ion-content`. Additionally, in order to get the large title styling, `ion-title` must have `size="large"`.

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'title-example',
  styleUrl: 'title-example.css'
})
export class TitleExample {
  render() {
    return [
      <ion-header translucent={true}>
        <ion-toolbar>
          <ion-buttons collapse={true} slot="end">
            <ion-button>Click Me</ion-button>
          </ion-buttons>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content fullscreen={true}>
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-buttons collapse={true} slot="end">
              <ion-button>Click Me</ion-button>
            </ion-buttons>
            <ion-title size="large">Settings</ion-title>
          </ion-toolbar>
          <ion-toolbar>
            <ion-searchbar></ion-searchbar>
          </ion-toolbar>
        </ion-header>

        ...

      </ion-content>
    ];
  }
}
```

In this example, notice that we have added two sets of `ion-buttons` both with `collapse` set to `true`. When the secondary header collapses, the buttons in the secondary header will hide, and the buttons in the primary header will show. This is useful for ensuring that your header buttons always appear next to an `ion-title` element.

`ion-buttons` elements that do not have `collapse` set will always be visible, regardless of collapsed state. When using the large title and `ion-buttons` elements inside of `ion-content`, the `ion-buttons` elements should always be placed in the `end` slot.

When styling the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

> When using collapsible large titles, it is required that `fullscreen` is set to `true` on `ion-content` and `translucent` is set to `true` on the main `ion-header`.

### Styling Collapsible Large Titles

The collapsible large title should appear seamless in relation to the rest of your content. This means that the background color of the `ion-toolbar` that contains the collapsible large title should always match the background color of `ion-content`. 

By default, the `ion-toolbar` that contains the standard title is hidden using `opacity: 0` and is progressively shown as you collapse the large title by scrolling. As a result, the background color that you see behind the standard title is actually the background color of `ion-content`.

You can change the background color of the toolbar with the standard title by setting the `--background` CSS variable on `ion-toolbar`. This will give the effect of the header changing color as you collapse the large title.

When styling the text color of the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

```css
ion-title.large-title {
  color: purple;
  font-size: 30px;
}
```


### Vue

```html
<template>
  <!-- Default title -->
  <ion-toolbar>
    <ion-title>Default Title</ion-title>
  </ion-toolbar>

  <!-- Small title -->
  <ion-toolbar>
    <ion-title size="small">Small Title above a Default Title</ion-title>
  </ion-toolbar>
  <ion-toolbar>
    <ion-title>Default Title</ion-title>
  </ion-toolbar>

  <!-- Large title -->
  <ion-toolbar>
    <ion-title size="large">Large Title</ion-title>
  </ion-toolbar>
</template>

<script>
import { IonTitle, IonToolbar } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonTitle, IonToolbar }
});
</script>
```

### Collapsible Large Titles

Ionic provides a way to create the collapsible titles that exist on stock iOS apps. Getting this setup requires configuring your `ion-title`, `ion-header`, and (optionally) `ion-buttons` elements.

```html
<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-title>Settings</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">Settings</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    ...

  </ion-content>
</template>

<script>
import { 
  IonContent, 
  IonHeader, 
  IonSearchbar, 
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonContent, 
    IonHeader, 
    IonSearchbar, 
    IonTitle, 
    IonToolbar
  }
});
</script>
```

In the example above, notice there are two `ion-header` elements. The first `ion-header` represents the "collapsed" state of your collapsible header, and the second `ion-header` represents the "expanded" state of your collapsible header. Notice that the second `ion-header` must have `collapse="condense"` and must exist within `ion-content`. Additionally, in order to get the large title styling, `ion-title` must have `size="large"`.

```html
<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons :collapse="true" slot="end">
        <ion-button>Click Me</ion-button>
      </ion-buttons>
      <ion-title>Settings</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content :fullscreen="true">
    <ion-header collapse="condense">
      <ion-toolbar>
        <ion-buttons :collapse="true" slot="end">
          <ion-button>Click Me</ion-button>
        </ion-buttons>
        <ion-title size="large">Settings</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    ...

  </ion-content>
</template>

<script>
import { 
  IonButton,
  IonButtons,
  IonContent, 
  IonHeader, 
  IonSearchbar, 
  IonTitle, 
  IonToolbar
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    IonButton,
    IonButtons,
    IonContent, 
    IonHeader, 
    IonSearchbar, 
    IonTitle, 
    IonToolbar
  }
});
</script>
```

In this example, notice that we have added two sets of `ion-buttons` both with `collapse` set to `true`. When the secondary header collapses, the buttons in the secondary header will hide, and the buttons in the primary header will show. This is useful for ensuring that your header buttons always appear next to an `ion-title` element.

`ion-buttons` elements that do not have `collapse` set will always be visible, regardless of collapsed state. When using the large title and `ion-buttons` elements inside of `ion-content`, the `ion-buttons` elements should always be placed in the `end` slot.

> When using collapsible large titles, it is required that `fullscreen` is set to `true` on `ion-content` and `translucent` is set to `true` on the main `ion-header`.

### Styling Collapsible Large Titles

The collapsible large title should appear seamless in relation to the rest of your content. This means that the background color of the `ion-toolbar` that contains the collapsible large title should always match the background color of `ion-content`. 

By default, the `ion-toolbar` that contains the standard title is hidden using `opacity: 0` and is progressively shown as you collapse the large title by scrolling. As a result, the background color that you see behind the standard title is actually the background color of `ion-content`.

You can change the background color of the toolbar with the standard title by setting the `--background` CSS variable on `ion-toolbar`. This will give the effect of the header changing color as you collapse the large title.

When styling the text color of the large title, you should target the large title globally as opposed to within the context of a particular page or tab, otherwise its styles will not be applied during the navigation animation.

```css
ion-title.large-title {
  color: purple;
  font-size: 30px;
}
```



## Properties

| Property | Attribute | Description                                                                                                                                                                                                                                                            | Type                              | Default     |
| -------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `color`  | `color`   | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`             | `undefined` |
| `size`   | `size`    | The size of the toolbar title.                                                                                                                                                                                                                                         | `"large" \| "small" \| undefined` | `undefined` |


## CSS Custom Properties

| Name      | Description             |
| --------- | ----------------------- |
| `--color` | Text color of the title |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
