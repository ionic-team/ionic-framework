# ion-split-pane

SplitPane is a component that makes it possible to create multi-view layout.
Similar to iPad apps, SplitPane allows UI elements, like Menus, to be
displayed as the viewport increases.

If the devices screen size is below a certain size, the SplitPane will
collapse and the menu will become hidden again. This is especially useful when
creating an app that will be served over a browser or deployed through the app
store to phones and tablets.

To use SplitPane, simply add the component around your root component.
In this example, we'll be using a sidemenu layout, similar to what is
provided from the sidemenu starter template.

```html
<ion-split-pane>
  <!--  our side menu  -->
  <ion-menu>
    <ion-header>
      <ion-toolbar>
        <ion-title>Menu</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-menu>

  <!-- the main content -->
  <ion-nav [root]="root" main></ion-nav>
</ion-split-pane>
```

Here, SplitPane will look for the element with the `main` attribute and make
that the central component on larger screens. The `main` component can be any
Ionic component (`ion-nav` or `ion-tabs`) except `ion-menu`.


### Setting breakpoints

By default, SplitPane will expand when the screen is larger than 768px.
If you want to customize this, use the `when` input. The `when` input can
accept any valid media query, as it uses `matchMedia()` underneath.

```
<ion-split-pane when="(min-width: 475px)">

  <!--  our side menu  -->
  <ion-menu>
  ....
  </ion-menu>

  <!-- the main content -->
  <ion-nav [root]="root" main></ion-nav>
</ion-split-pane>
```

SplitPane also provides some predefined media queries that can be used.

```html
<!-- could be "xs", "sm", "md", "lg", or "xl" -->
<ion-split-pane when="lg">
...
</ion-split-pane>
```


 | Size | Value                 | Description                                                           |
 |------|-----------------------|-----------------------------------------------------------------------|
 | `xs` | `(min-width: 0px)`    | Show the split-pane when the min-width is 0px (meaning, always)       |
 | `sm` | `(min-width: 576px)`  | Show the split-pane when the min-width is 576px                       |
 | `md` | `(min-width: 768px)`  | Show the split-pane when the min-width is 768px (default break point) |
 | `lg` | `(min-width: 992px)`  | Show the split-pane when the min-width is 992px                       |
 | `xl` | `(min-width: 1200px)` | Show the split-pane when the min-width is 1200px                      |

 You can also pass in boolean values that will trigger SplitPane when the value
 or expression evaluates to true.


 ```html
 <ion-split-pane [when]="isLarge">
 ...
 </ion-split-pane>
 ```

 ```ts
 class MyClass {
   public isLarge = false;
   constructor(){}
 }
 ```

 Or

 ```html
 <ion-split-pane [when]="shouldShow()">
 ...
 </ion-split-pane>
 ```

 ```ts
 class MyClass {
   constructor(){}
   shouldShow(){
     if(conditionA){
       return true
     } else {
       return false
     }
   }
 }
 ```


<!-- Auto Generated Below -->


## Properties

#### disabled

boolean

If `false`, the split-pane is disabled, ie. the side pane will
never be displayed. Default `true`.


#### when



When the split-pane should be shown.
Can be a CSS media query expression, or a shortcut expression.
Can also be a boolean expression.


## Attributes

#### disabled

boolean

If `false`, the split-pane is disabled, ie. the side pane will
never be displayed. Default `true`.


#### when



When the split-pane should be shown.
Can be a CSS media query expression, or a shortcut expression.
Can also be a boolean expression.


## Events

#### ionChange

Emitted when the split pane is visible.


#### ionSplitPaneDidChange

Expression to be called when the split-pane visibility has changed


## Methods

#### isVisible()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
