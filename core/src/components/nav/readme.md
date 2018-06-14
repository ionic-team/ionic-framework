# ion-nav



<!-- Auto Generated Below -->


## Properties

#### animated

boolean

If the nav should animate the components or not


#### delegate

FrameworkDelegate


#### root

string

Root NavComponent to load


#### rootParams

ComponentProps

Any parameters for the root component


#### swipeBackEnabled

boolean

If the nav component should allow for swipe-to-go-back


## Attributes

#### animated

boolean

If the nav should animate the components or not


#### delegate




#### root

string

Root NavComponent to load


#### root-params



Any parameters for the root component


#### swipe-back-enabled

boolean

If the nav component should allow for swipe-to-go-back


## Events

#### ionNavDidChange

Event fired when the nav has changed components


#### ionNavWillChange

Event fired when the nav will components


#### ionNavWillLoad

Event fired when Nav will load a component


## Methods

#### canGoBack()

Returns true or false if the current view can go back


#### getActive()

Gets the active view


#### getByIndex()

Returns the view at the index


#### getPrevious()

Gets the previous view


#### getRouteId()


#### insert()

Inserts a component into the nav stack at the specified index. This is useful if you need to add a component at any point in your navigation stack.


#### insertPages()

Inserts an array of components into the nav stack at the specified index. The last component in the array will become instantiated as a view, and animate in to become the active view.


#### isAnimating()

Returns the length of navigation stack


#### length()

Returns the length of navigation stack


#### pop()

Call to navigate back from a current component. Similar to push(), you can also pass navigation options.


#### popTo()

Pop to a specific index in the navigation stack


#### popToRoot()

Navigate back to the root of the stack, no matter how far back that is.


#### push()

Push a new component onto the current navigation stack. Pass any aditional information along as an object. This additional information is accessible through NavParams


#### removeIndex()

Removes a page from the nav stack at the specified index.


#### setPages()

Set the views of the current navigation stack and navigate to the last view. By default animations are disabled, but they can be enabled by passing options to the navigation controller.You can also pass any navigation params to the individual pages in the array.


#### setRoot()

Set the root for the current navigation stack.


#### setRouteId()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
