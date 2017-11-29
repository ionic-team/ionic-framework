# ion-fab

`<ion-fab>` is not a FAB button by itself but a container that assist the fab button (`<button ion-fab>`) allowing it
to be placed in fixed position that does not scroll with the content. It is also used to implement "material design speed dial",
ie. a FAB buttons displays a small lists of related actions when clicked.


```
[top] - Places the container on the top of the content
[bottom] - Places the container on the bottom  of the content
[left] - Places the container on the left
[right] - Places the container on the right
[middle] - Places the container on the middle vertically
[center] - Places the container on the center horizontally
[edge] - Used to place the container between the content and the header/footer
```


```html
<!-- this fab is placed at top right -->
<ion-content>
 <ion-fab top right>
   <button ion-fab>Button</button>
 </ion-fab>

 <!-- this fab is placed at the center of the content viewport -->
 <ion-fab center middle>
   <button ion-fab>Button</button>
 </ion-fab>
</ion-content>
```

Ionic's FAB also supports "material design's fab speed dial". It is a normal fab button
that shows a list of related actions when clicked.

The same `ion-fab` container can contain several `ion-fab-list` with different side values:
`top`, `bottom`, `left` and `right`. For example, if you want to have a list of button that are
on the top of the main button, you should use `side="top"` and so on. By default, if side is ommited, `side="bottom"`.


```html
<ion-content>
 <!-- this fab is placed at bottom right -->
 <ion-fab bottom right >
   <button ion-fab>Share</button>
   <ion-fab-list side="top">
     <button ion-fab>Facebook</button>
     <button ion-fab>Twitter</button>
     <button ion-fab>Youtube</button>
   </ion-fab-list>
   <ion-fab-list side="left">
     <button ion-fab>Vimeo</button>
   </ion-fab-list>
 </ion-fab>
</ion-content>
```

A FAB speed dial can also be closed programatically.

```html
<ion-content>
 <ion-fab bottom right #fab>
   <button ion-fab>Share</button>
   <ion-fab-list side="top">
     <button ion-fab (click)="share('facebook', fab)">Facebook</button>
     <button ion-fab (click)="share('twitter', fab)">Twitter</button>
   </ion-fab-list>
 </ion-fab>
</ion-content>
```

```ts
share(socialNet: string, fab: FabContainer) {
  fab.close();
  console.log("Sharing in", socialNet);
}
```


<!-- Auto Generated Below -->


## Methods

#### close()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
