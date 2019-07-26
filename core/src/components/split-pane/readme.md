# ion-split-pane

A split pane is useful when creating multi-view layouts. It allows UI elements, like menus, to be
displayed as the viewport width increases.

If the device's screen width is below a certain size, the split pane will collapse and the menu will be hidden. This is ideal for creating an app that will be served in a browser and deployed through the app store to phones and tablets.


### Setting Breakpoints

By default, the split pane will expand when the screen is larger than 992px. To customize this, pass a breakpoint in the `when` property. The `when` property can accept a boolean value, any valid media query, or one of Ionic's predefined sizes.


```html
<!-- can be "xs", "sm", "md", "lg", or "xl" -->
<ion-split-pane when="md"></ion-split-pane>

<!-- can be any valid media query https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries -->
<ion-split-pane when="(min-width: 40px)"></ion-split-pane>
```


 | Size | Value                 | Description                                                           |
 |------|-----------------------|-----------------------------------------------------------------------|
 | `xs` | `(min-width: 0px)`    | Show the split-pane when the min-width is 0px (meaning, always)       |
 | `sm` | `(min-width: 576px)`  | Show the split-pane when the min-width is 576px                       |
 | `md` | `(min-width: 768px)`  | Show the split-pane when the min-width is 768px                       |
 | `lg` | `(min-width: 992px)`  | Show the split-pane when the min-width is 992px (default break point) |
 | `xl` | `(min-width: 1200px)` | Show the split-pane when the min-width is 1200px                      |


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
import {
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonRouterOutlet,
  IonContent,
  IonPage
} from '@ionic/react';

export const SplitPlaneExample: React.SFC<{}> = () => (
  <IonContent>
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
      <IonPage id="menuContent"/>
    </IonSplitPane>
  </IonContent>
);
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

| Event                 | Description                                                        | Type                                 |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------ |
| `ionSplitPaneVisible` | Expression to be called when the split-pane visibility has changed | `CustomEvent<{ visible: boolean; }>` |


## CSS Custom Properties

| Name       | Description          |
| ---------- | -------------------- |
| `--border` | Border between panes |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
