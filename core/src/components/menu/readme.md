# ion-menu

The Menu component is a navigation drawer that slides in from the side of the current view.
By default, it slides in from the left, but the side can be overridden.
The menu will be displayed differently based on the mode, however the display type can be changed to any of the available menu types.
The menu element should be a sibling to the root content element.
There can be any number of menus attached to the content.
These can be controlled from the templates, or programmatically using the MenuController.


<!-- Auto Generated Below -->


## Properties

#### contentId

string

The content's id the menu should use.


#### disabled

boolean

If true, the menu is disabled. Default `false`.


#### maxEdgeStart

number

The edge threshold for dragging the menu open.
If a drag/swipe happens over this value, the menu is not triggered.


#### menuId

string

An id for the menu.


#### side

string

Which side of the view the menu should be placed. Default `"start"`.


#### swipeEnabled

boolean

If true, swiping the menu is enabled. Default `true`.


#### type

string

The display type of the menu.
Available options: `"overlay"`, `"reveal"`, `"push"`.


## Attributes

#### content-id

string

The content's id the menu should use.


#### disabled

boolean

If true, the menu is disabled. Default `false`.


#### max-edge-start

number

The edge threshold for dragging the menu open.
If a drag/swipe happens over this value, the menu is not triggered.


#### menu-id

string

An id for the menu.


#### side

string

Which side of the view the menu should be placed. Default `"start"`.


#### swipe-enabled

boolean

If true, swiping the menu is enabled. Default `true`.


#### type

string

The display type of the menu.
Available options: `"overlay"`, `"reveal"`, `"push"`.


## Events

#### ionClose

Emitted when the menu is closed.


#### ionMenuChange

Emitted when the menu state is changed.


#### ionOpen

Emitted when the menu is open.


## Methods

#### close()


#### getWidth()


#### isActive()


#### isOpen()


#### open()


#### setOpen()


#### toggle()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
