# ion-content

The content component provides an easy to use content area with some useful methods
to control the scrollable area. There should only be one content in a single
view.

Content, along with many other Ionic components, can be customized to modify its padding, margin, and more using the global styles provided in the [CSS Utilities](/docs/layout/css-utilities) or by individually styling it using CSS and the available [CSS Custom Properties](#css-custom-properties).


## Fixed Content

In order to place elements outside of the scrollable area, `slot="fixed"` can be added to the element. This will absolutely position the element placing it in the top left. In order to place the element in a different position, style it using [top, right, bottom, and left](https://developer.mozilla.org/en-US/docs/Web/CSS/position).

## Interfaces

### ScrollBaseDetail

```typescript
interface ScrollBaseDetail {
  isScrolling: boolean;
}
```

### ScrollDetail

```typescript
interface ScrollDetail extends GestureDetail, ScrollBaseDetail {
  scrollTop: number;
  scrollLeft: number;
}
```

### ScrollBaseCustomEvent 

While not required, this interface can be used in place of the `CustomEvent` interface for stronger typing on the `ionScrollStart` and `ionScrollEnd` events.

```typescript
interface ScrollBaseCustomEvent extends CustomEvent {
  detail: ScrollBaseDetail;
  target: HTMLIonContentElement;
}
```

### ScrollCustomEvent 

While not required, this interface can be used in place of the `CustomEvent` interface for stronger typing on the `ionScroll` event.

```typescript
interface ScrollCustomEvent extends ScrollBaseCustomEvent {
  detail: ScrollDetail;
}
```


<!-- Auto Generated Below -->


## Usage

### Angular

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


### Javascript

```html
<ion-content>
  <h1>Main Content</h1>

  <div slot="fixed">
    <h1>Fixed Content</h1>
  </div>
</ion-content>
```

```javascript
var content = document.querySelector('ion-content');
content.scrollEvents = true;
content.addEventListener('ionScrollStart', () => console.log('scroll start'));
content.addEventListener('ionScroll', (ev) => console.log('scroll', ev.detail));
content.addEventListener('ionScrollEnd', () => console.log('scroll end'));
```


### React

```tsx
import React from 'react';
import { IonContent } from '@ionic/react';

const ContentExample: React.FC = () => (
  <IonContent
    scrollEvents={true}
    onIonScrollStart={() => {}}
    onIonScroll={() => {}}
    onIonScrollEnd={() => {}}>
      <h1>Main Content</h1>

      <div slot="fixed">
        <h1>Fixed Content</h1>
      </div>
  </IonContent>
);
```


### Stencil

```tsx
import { Component, h } from '@stencil/core';

@Component({
  tag: 'content-example',
  styleUrl: 'content-example.css'
})
export class ContentExample {
  logScrollStart() {
    console.log('Scroll start');
  }

  logScrolling(ev) {
    console.log('Scrolling', ev);
  }

  logScrollEnd() {
    console.log('Scroll end');
  }

  render() {
    return [
      <ion-content
        scrollEvents={true}
        onIonScrollStart={() => this.logScrollStart()}
        onIonScroll={(ev) => this.logScrolling(ev)}
        onIonScrollEnd={() => this.logScrollEnd()}>
          <h1>Main Content</h1>

          <div slot="fixed">
            <h1>Fixed Content</h1>
          </div>
      </ion-content>
    ];
  }
}
```


### Vue

```html
<template>
  <ion-content
    :scroll-events="true"
    @ionScrollStart="logScrollStart()"
    @ionScroll="logScrolling($event)"
    @ionScrollEnd="logScrollEnd()">
      <h1>Main Content</h1>

      <div slot="fixed">
        <h1>Fixed Content</h1>
      </div>
  </ion-content>
</template>

<script>
import { IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { IonContent }
});
</script>

```



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                            | Type                   | Default     |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------- |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics). | `string \| undefined`  | `undefined` |
| `forceOverscroll` | `force-overscroll` | If `true` and the content does not cause an overflow scroll, the scroll interaction will cause a bounce. If the content exceeds the bounds of ionContent, nothing will change. Note, the does not disable the system bounce on iOS. That is an OS level setting.       | `boolean \| undefined` | `undefined` |
| `fullscreen`      | `fullscreen`       | If `true`, the content will scroll behind the headers and footers. This effect can easily be seen by setting the toolbar to transparent.                                                                                                                               | `boolean`              | `false`     |
| `scrollEvents`    | `scroll-events`    | Because of performance reasons, ionScroll events are disabled by default, in order to enable them and start listening from (ionScroll), set this property to `true`.                                                                                                   | `boolean`              | `false`     |
| `scrollX`         | `scroll-x`         | If you want to enable the content scrolling in the X axis, set this property to `true`.                                                                                                                                                                                | `boolean`              | `false`     |
| `scrollY`         | `scroll-y`         | If you want to disable the content scrolling in the Y axis, set this property to `false`.                                                                                                                                                                              | `boolean`              | `true`      |


## Events

| Event            | Description                                                                                      | Type                            |
| ---------------- | ------------------------------------------------------------------------------------------------ | ------------------------------- |
| `ionScroll`      | Emitted while scrolling. This event is disabled by default. Look at the property: `scrollEvents` | `CustomEvent<ScrollDetail>`     |
| `ionScrollEnd`   | Emitted when the scroll has ended.                                                               | `CustomEvent<ScrollBaseDetail>` |
| `ionScrollStart` | Emitted when the scroll has started.                                                             | `CustomEvent<ScrollBaseDetail>` |


## Methods

### `getScrollElement() => Promise<HTMLElement>`

Get the element where the actual scrolling takes place.
This element can be used to subscribe to `scroll` events or manually modify
`scrollTop`. However, it's recommended to use the API provided by `ion-content`:

i.e. Using `ionScroll`, `ionScrollStart`, `ionScrollEnd` for scrolling events
and `scrollToPoint()` to scroll the content into a certain point.

#### Returns

Type: `Promise<HTMLElement>`



### `scrollByPoint(x: number, y: number, duration: number) => Promise<void>`

Scroll by a specified X/Y distance in the component.

#### Returns

Type: `Promise<void>`



### `scrollToBottom(duration?: number) => Promise<void>`

Scroll to the bottom of the component.

#### Returns

Type: `Promise<void>`



### `scrollToPoint(x: number | undefined | null, y: number | undefined | null, duration?: number) => Promise<void>`

Scroll to a specified X/Y location in the component.

#### Returns

Type: `Promise<void>`



### `scrollToTop(duration?: number) => Promise<void>`

Scroll to the top of the component.

#### Returns

Type: `Promise<void>`




## Slots

| Slot      | Description                                                          |
| --------- | -------------------------------------------------------------------- |
|           | Content is placed in the scrollable area if provided without a slot. |
| `"fixed"` | Should be used for fixed content that should not scroll.             |


## Shadow Parts

| Part           | Description                              |
| -------------- | ---------------------------------------- |
| `"background"` | The background of the content.           |
| `"scroll"`     | The scrollable container of the content. |


## CSS Custom Properties

| Name                | Description                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------- |
| `--background`      | Background of the content                                                                                  |
| `--color`           | Color of the content                                                                                       |
| `--keyboard-offset` | Keyboard offset of the content                                                                             |
| `--offset-bottom`   | Offset bottom of the content                                                                               |
| `--offset-top`      | Offset top of the content                                                                                  |
| `--padding-bottom`  | Bottom padding of the content                                                                              |
| `--padding-end`     | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the content |
| `--padding-start`   | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the content |
| `--padding-top`     | Top padding of the content                                                                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
