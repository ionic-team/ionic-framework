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


#### badgeStyle

string


#### btnId

string


#### enabled

boolean


#### icon

string


#### path

string


#### selected

boolean


#### show

boolean


#### tabsHideOnSubPages

boolean


#### title

string


## Attributes

#### badge

string


#### badgeStyle

string


#### btnId

string


#### enabled

boolean


#### icon

string


#### path

string


#### selected

boolean


#### show

boolean


#### tabsHideOnSubPages

boolean


#### title

string


## Events

#### ionSelect


## Methods

#### _setActive()


#### getActive()


#### getNav()


#### goToRoot()



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
