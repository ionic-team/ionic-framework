```html
  <ion-drawer presentDefault="true">
    <h1>Header</h1>
    <div>Content</div> 
  </ion-drawer>
```

```javascript
var drawer = document.querySelector('ion-drawer');
    
// Optional parameters to pass to the drawer instance. See https://github.com/roman-rr/cupertino-pane/ for valid options.
drawer.options = {
  showDraggable: true,
  breaks: {
    top: { enabled: false, offset: 0 },
    middle: { enabled: true, offset: 0 },
    bottom: { enabled: true, offset: 0 },
  }
}
```
