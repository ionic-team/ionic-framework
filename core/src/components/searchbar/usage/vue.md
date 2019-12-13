```html
<template>
  <!-- Default Searchbar -->
  <ion-searchbar></ion-searchbar>

  <!-- Searchbar with cancel button always shown -->
  <ion-searchbar show-cancel-button="always"></ion-searchbar>

  <!-- Searchbar with cancel button never shown -->
  <ion-searchbar show-cancel-button="never"></ion-searchbar>

  <!-- Searchbar with cancel button shown on focus -->
  <ion-searchbar show-cancel-button="focus"></ion-searchbar>

  <!-- Searchbar with danger color -->
  <ion-searchbar color="danger"></ion-searchbar>

  <!-- Searchbar with value -->
  <ion-searchbar value="Ionic"></ion-searchbar>

  <!-- Searchbar with telephone type -->
  <ion-searchbar type="tel"></ion-searchbar>

  <!-- Searchbar with numeric inputmode -->
  <ion-searchbar inputmode="numeric"></ion-searchbar>

  <!-- Searchbar disabled -->
  <ion-searchbar disabled="true"></ion-searchbar>

  <!-- Searchbar with a cancel button and custom cancel button text -->
  <ion-searchbar show-cancel-button="focus" cancel-button-text="Custom Cancel"></ion-searchbar>

  <!-- Searchbar with a custom debounce -->
  <ion-searchbar debounce="500"></ion-searchbar>

  <!-- Animated Searchbar -->
  <ion-searchbar animated></ion-searchbar>

  <!-- Searchbar with a placeholder -->
  <ion-searchbar placeholder="Filter Schedules"></ion-searchbar>

  <!-- Searchbar in a Toolbar -->
  <ion-toolbar>
    <ion-searchbar></ion-searchbar>
  </ion-toolbar>
</template>
```

### Showing the proper keyboard submit button

#### Android

By default, tapping `ion-searchbar` will cause the keyboard to appear with a magnifying glass icon on the submit button. You can optionally set `inputmode="search"`, which will change the icon from a magnifying glass to a carriage return.

#### iOS

By default, tapping `ion-searchbar` will cause the keyboard to appear with the text "return" on a gray submit button. You can optionally set `inputmode="search"`, which will change the text from "return" to "go", and change the button color from gray to blue. Additionally, you can wrap the `ion-searchbar` in a `form` element with an `action` property. This will cause the keyboard to appear with a blue submit button that says "search".