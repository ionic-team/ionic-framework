```html
<ion-content>
  <ion-slides pager="true">
    <ion-slide>
      <h1>Slide 1</h1>
    </ion-slide>

    <ion-slide>
      <h1>Slide 2</h1>
    </ion-slide>

    <ion-slide>
      <h1>Slide 3</h1>
    </ion-slide>
  </ion-slides>
</ion-content>
```

```javascript
var slides = document.querySelector('ion-slides');

// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.
slides.options = {
  initialSlide: 1,
  speed: 400
}
```

```css
/* Without setting height the slides will take up the height of the slide's content */
ion-slides {
  height: 100%;
}
```
