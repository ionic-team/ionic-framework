```html
<template>
  <!-- Default Searchbar -->
  <ion-searchbar></ion-searchbar>
  
  <!-- Searchbar with cancel button always shown -->
  <ion-searchbar showCancelButton="always"></ion-searchbar>
  
  <!-- Searchbar with cancel button never shown -->
  <ion-searchbar showCancelButton="never"></ion-searchbar>
  
  <!-- Searchbar with cancel button shown on focus -->
  <ion-searchbar showCancelButton="focus"></ion-searchbar>

  <!-- Searchbar with danger color -->
  <ion-searchbar color="danger"></ion-searchbar>

  <!-- Searchbar with value -->
  <ion-searchbar value="Ionic"></ion-searchbar>

  <!-- Searchbar with telephone type -->
  <ion-searchbar type="tel"></ion-searchbar>

  <!-- Searchbar disabled -->
  <ion-searchbar disabled="true"></ion-searchbar>

  <!-- Searchbar with a cancel button and custom cancel button text -->
  <ion-searchbar showCancelButton="focus" cancelButtonText="Custom Cancel"></ion-searchbar>

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
