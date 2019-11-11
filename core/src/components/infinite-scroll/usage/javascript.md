```html
<ion-content>
  <ion-button onClick="toggleInfiniteScroll()" expand="block">
    Toggle Infinite Scroll
  </ion-button>

  <ion-list></ion-list>

  <ion-infinite-scroll threshold="100px" id="infinite-scroll">
    <ion-infinite-scroll-content
      loading-spinner="bubbles"
      loading-text="Loading more data...">
    </ion-infinite-scroll-content>
  </ion-infinite-scroll>
</ion-content>
```

```javascript
const infiniteScroll = document.getElementById('infinite-scroll');

infiniteScroll.addEventListener('ionInfinite', function(event) {
  setTimeout(function() {
    console.log('Done');
    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (data.length == 1000) {
      event.target.disabled = true;
    }
  }, 500);
});

function toggleInfiniteScroll() {
  infiniteScroll.disabled = !infiniteScroll.disabled;
}
```
