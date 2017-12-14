# ion-button

Buttons provide a clickable element, which can be used in forms, or anywhere that needs simple, standard button functionality. They may display text, icons, or both. Buttons can be styled with several attributes to look a specific way.

## Expand

This attribute lets you specify how wide the button should be. By default, buttons are inline blocks, but setting this attribute will change the button to a full-width block element.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `block`        | Full-width button with rounded corners.                                      |
| `full`         | Full-width button with square corners and no border on the left or right.    |

## Fill

This attributes determines the background and border color of the button. By default, buttons have a solid background unless the button is inside of a toolbar, in which case it has a transparent background.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `clear`        | Button with a transparent background that resembles a flat button.           |
| `outline`      | Button with a transparent background and a visible border.                   |
| `solid`        | Button with a filled background. Useful for buttons in a toolbar.            |

## Size

This attribute specifies the size of the button. Setting this attribute will change the height and padding of a button.

| Value          | Details                                                                      |
|----------------|------------------------------------------------------------------------------|
| `small`        | Button with less height and padding. Default for buttons in an item.         |
| `default`      | Button with the default height and padding. Useful for buttons in an item.   |
| `large`        | Button with more height and padding.                                         |


```html
<!-- Colors -->
<ion-button>Default</ion-button>
<ion-button color="secondary">Secondary</ion-button>
<ion-button color="warning">Warning</ion-button>
<ion-button color="danger">Danger</ion-button>
<ion-button color="light">Light</ion-button>
<ion-button color="dark">Dark</ion-button>

<!-- Expand -->
<ion-button expand="full">Full Button</ion-button>
<ion-button expand="block">Block Button</ion-button>
<ion-button round>Round Button</ion-button>

<!-- Fill -->
<ion-button expand="full" fill="outline">Outline + Full</ion-button>
<ion-button expand="block" fill="outline">Outline + Block</ion-button>
<ion-button round fill="outline">Outline + Round</ion-button>

<!-- Icons -->
<ion-button>
  <ion-icon slot="start" name="star"></ion-icon>
  Left Icon
</ion-button>

<ion-button>
  Right Icon
  <ion-icon slot="end" name="star"></ion-icon>
</ion-button>

<ion-button>
  <ion-icon slot="icon-only" name="star"></ion-icon>
</ion-button>

<!-- Sizes -->
<ion-button size="large">Large</ion-button>
<ion-button>Default</ion-button>
<ion-button size="small">Small</ion-button>
```


<!-- Auto Generated Below -->


## Properties

#### buttonType

string


#### color

string


#### disabled

boolean


#### expand

any


#### fill

any


#### href

string


#### mode

any


#### round

boolean


#### size

any


#### strong

boolean


## Attributes

#### buttonType

string


#### color

string


#### disabled

boolean


#### expand

any


#### fill

any


#### href

string


#### mode

any


#### round

boolean


#### size

any


#### strong

boolean



----------------------------------------------

*Built by [StencilJS](https://stenciljs.com/)*
