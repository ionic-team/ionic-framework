```html
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
```

```javascript
var slides = document.querySelector('ion-slides');
slides.options = {
  effect: 'flip'
}
```
