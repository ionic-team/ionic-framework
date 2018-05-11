# ion-fab

Fabs are container elements that contain one or more fab buttons. They should be placed in a fixed position that does not scroll with the content. The following attributes can be used to position the fab with respect to the content:

| Value        | Alignment  | Details                                                                   |
|--------------|------------|---------------------------------------------------------------------------|
| `top`        | vertical   | Places the container at the top of the content.                           |
| `bottom`     | vertical   | Places the container at the bottom of the content.                        |
| `middle`     | vertical   | Places the container in the middle vertically.                            |
| `edge`       | vertical   | Used to place the container between the content and the header/footer.    |
| `left`       | horizontal | Places the container on the left.                                         |
| `right`      | horizontal | Places the container on the right.                                        |
| `center`     | horizontal | Places the container in the center horizontally.                          |

The fab should have one main fab button. Fabs can also contain fab lists which contain related buttons that show when the main fab button is clicked. The same fab container can contain several [fab list](../../fab-list/FabList) elements with different side values.

```html
<ion-content>
  <!-- fab placed to the top right -->
  <ion-fab top right slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom right -->
  <ion-fab bottom right slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-dropleft"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the top left -->
  <ion-fab top left slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-dropright"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom left -->
  <ion-fab bottom left slot="fixed">
    <ion-fab-button>
      <ion-icon name="arrow-dropup"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the left and middle -->
  <ion-fab left middle slot="fixed">
    <ion-fab-button>
      <ion-icon name="share"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the right and middle -->
  <ion-fab right middle slot="fixed">
    <ion-fab-button>
      <ion-icon name="add"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the top and right and on the top edge of the content overlapping header -->
  <ion-fab top right edge slot="fixed">
    <ion-fab-button>
      <ion-icon name="person"></ion-icon>
    </ion-fab-button>
  </ion-fab>

  <!-- fab placed to the bottom and left and on the bottom edge of the content overlapping footer with a list to the right -->
  <ion-fab bottom left edge slot="fixed">
    <ion-fab-button>
      <ion-icon name="settings"></ion-icon>
    </ion-fab-button>
    <ion-fab-list side="end">
      <ion-fab-button><ion-icon name="logo-vimeo"></ion-icon></ion-fab-button>
    </ion-fab-list>
  </ion-fab>

  <!-- fab placed in the center of the content with a list on each side -->
  <ion-fab center middle slot="fixed">
    <ion-fab-button><ion-icon name="share"></ion-icon></ion-fab-button>
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

#### alt

string

This attribute defines the alternative text describing the image.
Users will see this text displayed if the image URL is wrong,
the image is not in one of the supported formats, or if the image is not yet downloaded.


#### src

string

The image URL. This attribute is mandatory for the <img> element.


## Attributes

#### alt

string

This attribute defines the alternative text describing the image.
Users will see this text displayed if the image URL is wrong,
the image is not in one of the supported formats, or if the image is not yet downloaded.


#### src

string

The image URL. This attribute is mandatory for the <img> element.


## Events

#### ionImgDidLoad



----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
