# ion-tab

The Tab component, written `<ion-tab>`, is styled based on the mode and should
be used in conjunction with the [Tabs](../Tabs/) component.

Each `ion-tab` is a declarative component for a [NavController](../../../navigation/NavController/).
Basically, each tab is a `NavController`. For more information on using
navigation controllers take a look at the [NavController API Docs](../../../navigation/NavController/).

See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.

To add a basic tab, you can use the following markup where the `root` property
is the page you want to load for that tab, `tabTitle` is the optional text to
display on the tab, and `tabIcon` is the optional [icon](../../icon/Icon/).

```html
<ion-tabs>
 <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"></ion-tab>
</ion-tabs>
```


Sometimes you may want to call a method instead of navigating to a new
page. You can use the `(ionSelect)` event to call a method on your class when
the tab is selected. Below is an example of presenting a modal from one of
the tabs.

```html
<ion-tabs>
  <ion-tab (ionSelect)="chat()" tabTitle="Show Modal"></ion-tab>
</ion-tabs>pop
```

```ts
export class Tabs {
  constructor(public modalCtrl: ModalController) {

  }

  chat() {
    let modal = this.modalCtrl.create(ChatPage);
    modal.present();
  }
}
```


<!-- Auto Generated Below -->


## Properties

#### badge

string

The badge for the tab button.


#### badgeStyle

string

The badge color for the tab button.


#### btnId

string

Set the root page for this tab.


#### disabled

boolean

If true, enable the tab. If false,
the user cannot interact with this element.
Default: `true`.


#### icon

string

The icon for the tab button.


#### path

string

The URL path name to represent this tab within the URL.


#### selected

boolean


#### show

boolean

If true, the tab button is visible within the
tabbar. Default: `true`.


#### tabsHideOnSubPages

boolean

If true, hide the tabs on child pages.


#### title

string

The title of the tab button.


## Attributes

#### badge

string

The badge for the tab button.


#### badge-style

string

The badge color for the tab button.


#### btn-id

string

Set the root page for this tab.


#### disabled

boolean

If true, enable the tab. If false,
the user cannot interact with this element.
Default: `true`.


#### icon

string

The icon for the tab button.


#### path

string

The URL path name to represent this tab within the URL.


#### selected

boolean


#### show

boolean

If true, the tab button is visible within the
tabbar. Default: `true`.


#### tabs-hide-on-sub-pages

boolean

If true, hide the tabs on child pages.


#### title

string

The title of the tab button.


## Events

#### ionSelect

Emitted when the current tab is selected.


## Methods

#### getPath()


#### setActive()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
