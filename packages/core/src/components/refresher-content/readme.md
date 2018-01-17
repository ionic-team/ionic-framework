# ion-refresher-content

By default, Ionic provides the pulling icon and refreshing spinner that looks
best for the platform the user is on. However, you can change the default icon
and spinner, along with adding text for each state by adding properties to the
child `ion-refresher-content` component.

```html
<ion-content>

  <ion-refresher>
    <ion-refresher-content
      pullingIcon="arrow-dropdown"
      pullingText="Pull to refresh"
      refreshingSpinner="circles"
      refreshingText="Refreshing...">
    </ion-refresher-content>
  </ion-refresher>
</ion-content>
```

The `ion-refresher` component holds the refresh logic. It requires a child
component in order to display the content. Ionic uses `ion-refresher-content` by
default. This component displays the refresher and changes the look depending on
the refresher's state. Separating these components allows developers to create
their own refresher content components. You could replace our default content
with custom SVG or CSS animations.

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



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
