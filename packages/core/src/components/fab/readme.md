# ion-fab

FABs (Floating Action Buttons) are standard material design components. They are shaped as a circle that represents a promoted action. When pressed, it may contain more related actions.
FABs as its name suggests are floating over the content in a fixed position. This is not achieved exclusively with `<button ion-fab>Button</button>` but it has to wrapped with the `<ion-fab>` component, like this:

```html
<ion-content>
 <!-- Real floating action button, fixed. It will not scroll with the content -->
 <ion-fab>
   <button ion-fab>Button</button>
 </ion-fab>

 <!-- Button shaped as a circle that just like a normal button scrolls with the content -->
 <button ion-fab>Button</button>
</ion-content>
```

In case the button is not wrapped with `<ion-fab>`, the fab button will behave like a normal button, scrolling with the content.

```html

<!-- Colors -->
<ion-fab>
  <button ion-fab color="primary">Button</button>
</ion-fab>

<!-- Mini -->
<ion-fab>
  <button ion-fab mini>Small</button>
</ion-fab>
```


<!-- Auto Generated Below -->


## Properties

#### activated

boolean


#### color

string


#### disabled

boolean


#### href

string


#### mode

any


#### show

boolean


#### toggleActive

any


#### translucent

boolean


## Attributes

#### activated

boolean


#### color

string


#### disabled

boolean


#### href

string


#### mode

any


#### show

boolean


#### toggleActive

any


#### translucent

boolean



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
