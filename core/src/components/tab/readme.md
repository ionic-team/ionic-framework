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

#### active

boolean


#### btnId

string


#### component



The component to display inside of the tab.


#### delegate




#### disabled

boolean

If true, the user cannot interact with the tab. Defaults to `false`.


#### href

string

The URL which will be used as the `href` within this tab's `<ion-tab-button>` anchor.


#### name

string

The name of the tab.


#### selected

boolean

If true, the tab will be selected. Defaults to `false`.


#### show

boolean

If true, the tab button is visible within the tabbar. Defaults to `true`.


#### tabBadge

string

The badge for the tab.


#### tabBadgeStyle

string

The badge color for the tab button.


#### tabIcon

string

The icon for the tab.


#### tabTitle

string

The title of the tab.


#### tabsHideOnSubPages

boolean

If true, hide the tabs on child pages.


## Attributes

#### active

boolean


#### btn-id

string


#### component



The component to display inside of the tab.


#### delegate




#### disabled

boolean

If true, the user cannot interact with the tab. Defaults to `false`.


#### href

string

The URL which will be used as the `href` within this tab's `<ion-tab-button>` anchor.


#### name

string

The name of the tab.


#### selected

boolean

If true, the tab will be selected. Defaults to `false`.


#### show

boolean

If true, the tab button is visible within the tabbar. Defaults to `true`.


#### tab-badge

string

The badge for the tab.


#### tab-badge-style

string

The badge color for the tab button.


#### tab-icon

string

The icon for the tab.


#### tab-title

string

The title of the tab.


#### tabs-hide-on-sub-pages

boolean

If true, hide the tabs on child pages.


## Events

#### ionSelect

Emitted when the current tab is selected.


## Methods

#### getTabId()


#### setActive()



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
