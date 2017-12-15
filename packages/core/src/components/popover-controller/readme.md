# ion-popover-controller

A Popover is a dialog that appears on top of the current page.
It can be used for anything, but generally it is used for overflow
actions that don't fit in the navigation bar.

### Creating
A popover can be created by calling the `create` method. The view
to display in the popover should be passed as the first argument.
Any data to pass to the popover view can optionally be passed in
the second argument. Options for the popover can optionally be
passed in the third argument. See the [create](#create) method
below for all available options.

### Presenting
To present a popover, call the `present` method on a PopoverController instance.
In order to position the popover relative to the element clicked, a click event
needs to be passed into the options of the the `present` method. If the event
is not passed, the popover will be positioned in the center of the current
view. See the [usage](#usage) section for an example of passing this event.



<!-- Auto Generated Below -->


## Methods

#### create()

Create a popover component instance



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
