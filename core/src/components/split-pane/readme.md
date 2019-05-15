# ion-split-pane

SplitPane is a component that makes it possible to create multi-view layout.
Similar to iPad apps, SplitPane allows UI elements, like Menus, to be
displayed as the viewport increases.

If the devices screen size is below a certain size, the SplitPane will
collapse and the menu will become hidden again. This is especially useful when
creating an app that will be served over a browser or deployed through the app
store to phones and tablets.


### Setting breakpoints

By default, SplitPane will expand when the screen is larger than 992px.
If you want to customize this, use the `when` input. The `when` input can
accept any valid media query, as it uses `matchMedia()` underneath.


SplitPane also provides some predefined media queries that can be used.

```html
<!-- could be "xs", "sm", "md", "lg", or "xl" -->
<ion-split-pane when="md"></ion-split-pane>
```


 | Size | Value                 | Description                                                           |
 |------|-----------------------|-----------------------------------------------------------------------|
 | `xs` | `(min-width: 0px)`    | Show the split-pane when the min-width is 0px (meaning, always)       |
 | `sm` | `(min-width: 576px)`  | Show the split-pane when the min-width is 576px                       |
 | `md` | `(min-width: 768px)`  | Show the split-pane when the min-width is 768px                       |
 | `lg` | `(min-width: 992px)`  | Show the split-pane when the min-width is 992px (default break point) |
 | `xl` | `(min-width: 1200px)` | Show the split-pane when the min-width is 1200px                      |

 You can also pass in boolean values that will trigger SplitPane when the value
 or expression evaluates to true.


<!-- Auto Generated Below -->


## Usage

### Angular

```html
<ion-split-pane contentId="menu-content">
  <!--  our side menu  -->
  <ion-menu contentId="menu-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-menu>

  <!-- the main content -->
  <ion-router-outlet id="menu-content"></ion-router-outlet>
</ion-split-pane>
```


### Javascript

```html
<ion-split-pane content-id="menu-content">
  <!--  our side menu  -->
  <ion-menu content-id="menu-content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-menu>

  <!-- the main content -->
  <ion-content id="menu-content">
    <h1>Hello</h1>
  </ion-content>
</ion-split-pane>
```


### React

```tsx
import React from 'react';

import { IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonRouterOutlet } from '@ionic/react';

const Example: React.SFC<{}> = () => (

  <IonSplitPane contentId="menuContent">
    {/*--  our side menu  --*/}
    <IonMenu contentId="menuContent">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
    </IonMenu>

    {/*-- the main content --*/}
    <IonRouterOutlet></IonRouterOutlet>
  </IonSplitPane>
);

export default Example;
```


### Vue

```html
<template>
  <ion-split-pane contentId="menu-content">
    <!--  our side menu  -->
    <ion-menu contentId="menu-content">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-menu>

    <!-- the main content -->
    <ion-router-outlet id="menu-content"></ion-router-outlet>
  </ion-split-pane>
</template>
```



## Properties

| Property    | Attribute    | Description                                                                                                                                                    | Type                  | Default       |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------- |
| `contentId` | `content-id` | The content `id` of the split-pane's main content. This property can be used instead of the `[main]` attribute to select the `main` content of the split-pane. | `string \| undefined` | `undefined`   |
| `disabled`  | `disabled`   | If `true`, the split pane will be hidden.                                                                                                                      | `boolean`             | `false`       |
| `when`      | `when`       | When the split-pane should be shown. Can be a CSS media query expression, or a shortcut expression. Can also be a boolean expression.                          | `boolean \| string`   | `QUERY['lg']` |


## Events

| Event                 | Description                                                        | Type                              |
| --------------------- | ------------------------------------------------------------------ | --------------------------------- |
| `ionSplitPaneVisible` | Expression to be called when the split-pane visibility has changed | `CustomEvent<{visible: boolean}>` |


## CSS Custom Properties

| Name       | Description          |
| ---------- | -------------------- |
| `--border` | Border between panes |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
