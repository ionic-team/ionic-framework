# ion-tabs

Tabs make it easy to navigate between different pages or functional
aspects of an app. The Tabs component, written as `<ion-tabs>`, is
a container of individual [Tab](../Tab/) components. Each individual `ion-tab`
is a declarative component for a [NavController](../../../navigation/NavController/)

For more information on using nav controllers like Tab or [Nav](../../nav/Nav/),
take a look at the [NavController API Docs](../../../navigation/NavController/).


### Placement

The position of the tabs relative to the content varies based on
the mode. The tabs are placed at the bottom of the screen
for iOS and Android, and at the top for Windows by default. The position can
be configured using the `tabsPlacement` attribute on the `<ion-tabs>` component,
or in an app's [config](../../config/Config/).
See the [Input Properties](#input-properties) below for the available
values of `tabsPlacement`.


### Layout

The layout for all of the tabs can be defined using the `tabsLayout`
property. If the individual tab has a title and icon, the icons will
show on top of the title by default. All tabs can be changed by setting
the value of `tabsLayout` on the `<ion-tabs>` element, or in your
app's [config](../../config/Config/). For example, this is useful if
you want to show tabs with a title only on Android, but show icons
and a title for iOS. See the [Input Properties](#input-properties)
below for the available values of `tabsLayout`.


### Selecting a Tab

There are different ways you can select a specific tab from the tabs
component. You can use the `selectedIndex` property to set the index
on the `<ion-tabs>` element, or you can call `select()` from the `Tabs`
instance after creation. See [usage](#usage) below for more information.


You can add a basic tabs template to a `@Component` using the following
template:

```html
<ion-tabs>
  <ion-tab [root]="tab1Root"></ion-tab>
  <ion-tab [root]="tab2Root"></ion-tab>
  <ion-tab [root]="tab3Root"></ion-tab>
</ion-tabs>
```

Where `tab1Root`, `tab2Root`, and `tab3Root` are each a page:


By default, the first tab will be selected upon navigation to the
Tabs page. We can change the selected tab by using `selectedIndex`
on the `<ion-tabs>` element:

```html
<ion-tabs selectedIndex="2">
  <ion-tab [root]="tab1Root"></ion-tab>
  <ion-tab [root]="tab2Root"></ion-tab>
  <ion-tab [root]="tab3Root"></ion-tab>
</ion-tabs>
```

```html
<ion-tabs #myTabs>
  <ion-tab [root]="tab1Root"></ion-tab>
  <ion-tab [root]="tab2Root"></ion-tab>
  <ion-tab [root]="tab3Root"></ion-tab>
</ion-tabs>
```

Then in your class you can grab the `Tabs` instance and call `select()`,
passing the index of the tab as the argument. Here we're grabbing the tabs
by using ViewChild.

You can also switch tabs from a child component by calling `select()` on the
parent view using the `NavController` instance. For example, assuming you have
a `TabsPage` component, you could call the following from any of the child
components to switch to `TabsRoot3`:



<!-- Auto Generated Below -->


## Properties

#### name

string


#### scrollable

boolean


#### tabbarHidden

boolean


#### tabbarHighlight

boolean


#### tabbarLayout

string


#### tabbarPlacement

string


#### translucent

boolean


## Attributes

#### name

string


#### scrollable

boolean


#### tabbarHidden

boolean


#### tabbarHighlight

boolean


#### tabbarLayout

string


#### tabbarPlacement

string


#### translucent

boolean


## Events

#### ionChange


## Methods

#### getByIndex()


#### getIndex()


#### getSelected()


#### getTabs()


#### select()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
