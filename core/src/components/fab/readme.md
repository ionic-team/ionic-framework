# ion-fab

Fabs are container elements that contain one or more fab buttons. They should be placed in a fixed position that does not scroll with the content. The following attributes can be used to position the fab with respect to the content:

| Attribute  | Value        | Details                                                                               |
|------------|--------------|---------------------------------------------------------------------------------------|
| vertical   | `"top"`      | Places the container at the top of the content.                                       |
| vertical   | `"bottom"`   | Places the container at the bottom of the content.                                    |
| vertical   | `"center"`   | Places the container in the center/middle vertically.                                 |
| edge       | `"edge"`     | Used to place the container vertically between the content and the header/footer.     |
| horizontal | `"start"`    | Places the container in the start slot (i.e. on the left in LTR, on the right in RTL).|
| horizontal | `"end"`      | Places the container in the end slot (i.e. on the right in LTR, on the left in RTL).  |
| horizontal | `"center"`   | Places the container in the center horizontally.                                      |

The fab should have one main fab button. Fabs can also contain fab lists which contain related buttons that show when the main fab button is clicked. The same fab container can contain several [fab list](../../fab-list/FabList) elements with different side values.

```html
<ion-content>
  <!-- fab placed to the top end -->
  <ion-fab vertical="top" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom end -->
  <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-dropleft"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the top start -->
  <ion-fab vertical="top" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-dropright"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom start -->
  <ion-fab vertical="bottom" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-dropup"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the (vertical) center and start -->
  <ion-fab vertical="center" horizontal="start" slot="fixed">
    <ion-fab-button>
      <ion-icon name="share"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the (vertical) center and end -->
  <ion-fab vertical="center" horizontal="end" slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the top and end and on the top edge of the content overlapping header -->
  <ion-fab vertical="top" horizontal="end" edge slot="fixed">
    <ion-fab-button>
      <ion-icon name="person"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom and start and on the bottom edge of the content overlapping footer with a list to the right -->
  <ion-fab vertical="bottom" horizontal="start" edge slot="fixed">
    <ion-fab-button>
      <ion-icon name="settings"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="end">
      <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
    </ion-fab-list>
  </ion-fab>

  <!-- fab placed in the center of the content with a list on each side -->
  <ion-fab vertical="center" horizontal="center" slot="fixed">
    <ion-fab-button>
      <ion-icon name="share"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="top">
      <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
    </ion-fab-list>
    <ion-fab-list side="bottom">
      <ion-fab-button><ion-icon name="logo-facebook"></ion-icon></ion-fab-button>
    </ion-fab-list>
    <ion-fab-list side="start">
      <ion-fab-button><ion-icon name="logo-googleplus"></ion-icon></ion-fab-button>
    </ion-fab-list>
    <ion-fab-list side="end">
      <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
    </ion-fab-list>
  </ion-fab>
</ion-content>
```


<!-- Auto Generated Below -->


## Properties

#### activated

boolean


#### edge

boolean

If true, the fab will display on the edge of the header if
`vertical` is `"top"`, and on the edge of the footer if
it is `"bottom"`. Should be used with a `fixed` slot.


#### horizontal

string

Where to align the fab horizontally in the viewport.
Possible values are: `"center"`, `"start"`, `"end"`.


#### vertical

string

Where to align the fab vertically in the viewport.
Possible values are: `"top"`, `"center"`, `"bottom"`.


## Attributes

#### activated

boolean


#### edge

boolean

If true, the fab will display on the edge of the header if
`vertical` is `"top"`, and on the edge of the footer if
it is `"bottom"`. Should be used with a `fixed` slot.


#### horizontal

string

Where to align the fab horizontally in the viewport.
Possible values are: `"center"`, `"start"`, `"end"`.


#### vertical

string

Where to align the fab vertically in the viewport.
Possible values are: `"top"`, `"center"`, `"bottom"`.


## Methods

#### close()

Close an active FAB list container



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
