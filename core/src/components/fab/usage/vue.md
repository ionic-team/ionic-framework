```html
<template>
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
        <ion-fab-button><ion-icon name="logo-instagram"></ion-icon></ion-fab-button>
      </ion-fab-list>
      <ion-fab-list side="end">
        <ion-fab-button><ion-icon name="logo-twitter"></ion-icon></ion-fab-button>
      </ion-fab-list>
    </ion-fab>
  </ion-content>
</template>
```
