# ion-refresher-content

The refresher content contains the text, icon and spinner to display during a pull-to-refresh. Ionic provides the pulling icon and refreshing spinner based on the platform. However, the default icon, spinner, and text can be customized based on the state of the refresher.

```html
<ion-content>
  <ion-refresher slot="fixed">
    <ion-refresher-content
      pulling-icon="arrow-dropdown"
      pulling-text="Pull to refresh"
      refreshing-spinner="circles"
      refreshing-text="Refreshing...">
    </ion-refresher-content>
  </ion-refresher>
</ion-content>
```


<!-- Auto Generated Below -->


## Properties

#### pullingIcon

string

A static icon to display when you begin to pull down


#### pullingText

string

The text you want to display when you begin to pull down


#### refreshingSpinner

string

An animated SVG spinner that shows when refreshing begins


#### refreshingText

string

The text you want to display when performing a refresh


## Attributes

#### pulling-icon

string

A static icon to display when you begin to pull down


#### pulling-text

string

The text you want to display when you begin to pull down


#### refreshing-spinner

string

An animated SVG spinner that shows when refreshing begins


#### refreshing-text

string

The text you want to display when performing a refresh



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
