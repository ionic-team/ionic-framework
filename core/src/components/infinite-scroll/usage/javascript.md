```html
  <ion-content id="content">
    <ion-list></ion-list>
    <ion-infinite-scroll threshold="100px" id="infinite-scroll">
      <ion-infinite-scroll-content
        loadingSpinner="bubbles"
        loadingText="Loading more data...">
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
  }, 2000);
});
```
