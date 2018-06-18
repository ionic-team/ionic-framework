# ion-tabs

Tabs are a top level navigation component for created multiple stacked navs.
The component is a container of individual [Tab](../Tab/) components.


<!-- Auto Generated Below -->


## Properties

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.


#### name

string

A unique name for the tabs


#### scrollable

boolean

If the tabs should be scrollable


#### tabbarHidden

boolean

If true, the tabbar


#### tabbarHighlight

boolean

If true, show the tab highlight bar under the selected tab.


#### tabbarLayout

string

Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.


#### tabbarPlacement

string

Set position of the tabbar: `top`, `bottom`.


#### translucent

boolean

If true, the tabs will be translucent.
Note: In order to scroll content behind the tabs, the `fullscreen`
attribute needs to be set on the content.
Defaults to `false`.


#### useRouter

boolean

If the tabs should use the router or not.
If true, `selectedTab` does nothing.


## Attributes

#### color

string

The color to use from your Sass `$colors` map.
Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.


#### name

string

A unique name for the tabs


#### scrollable

boolean

If the tabs should be scrollable


#### tabbar-hidden

boolean

If true, the tabbar


#### tabbar-highlight

boolean

If true, show the tab highlight bar under the selected tab.


#### tabbar-layout

string

Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.


#### tabbar-placement

string

Set position of the tabbar: `top`, `bottom`.


#### translucent

boolean

If true, the tabs will be translucent.
Note: In order to scroll content behind the tabs, the `fullscreen`
attribute needs to be set on the content.
Defaults to `false`.


#### use-router

boolean

If the tabs should use the router or not.
If true, `selectedTab` does nothing.


## Events

#### ionChange

Emitted when the tab changes.


#### ionNavDidChange


#### ionNavWillChange


#### ionNavWillLoad


## Methods

#### getRouteId()


#### getSelected()

Get the currently selected tab


#### getTab()

Get the tab at the given index


#### select()

Index or the Tab instance, of the tab to select.


#### setRouteId()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
