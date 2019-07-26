# ion-item

Items are elements that can contain text, icons, avatars, images, inputs, and any other native or custom elements. Generally they are placed in a list with other items. Items can be swiped, deleted, reordered, edited, and more.

## Clickable Items

An item is considered "clickable" if it has an `href` or `button` property set. Clickable items have a few visual differences that indicate they can be interacted with. For example, a clickable item receives the ripple effect upon activation in `md` mode, has a highlight when activated in `ios` mode, and has a [detail arrow](/#detail-arrows) by default in `ios` mode.

## Detail Arrows

By default [clickable items](/#clickable-items) will display a right arrow icon on `ios` mode. To hide the right arrow icon on clickable elements, set the `detail` property to `false`. To show the right arrow icon on an item that doesn't display it naturally, set the `detail` property to `true`.

<!--

TODO add this functionality back as a css variable

This feature is not enabled by default on clickable items for the `md` mode, but it can be enabled by setting the following CSS variable:

```css
--item-detail-push-show: true;
```

See the [theming documentation](/docs/theming/css-variables) for more information.

-->


## Item Placement

Item uses named [slots](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot) in order to position content. This logic makes it possible to write a complex item with simple, understandable markup without having to worry about styling and positioning the elements.

The below chart details the item slots and where it will place the element inside of the item:

| Slot    | Description                                                                 |
|---------|-----------------------------------------------------------------------------|
| `start` | Placed to the left of all other content in LTR, and to the `right` in RTL.  |
| `end`   | Placed to the right of all other content in LTR, and to the `left` in RTL.  |
| none    | Placed inside of the input wrapper.                                         |


### Text Alignment

Items left align text and add an ellipsis when the text is wider than the item. See the [Utility Attributes Documentation](/docs/layout/css-utilities) for attributes that can be added to `<ion-item>` to transform the text.


## Input Highlight

### Highlight Height

Items containing an input will highlight the bottom border of the input with a different color when focused, valid, or invalid. By default, `md` items have a highlight with a height set to `2px` and `ios` has no highlight (technically the height is set to `0`). The height can be changed using the `--highlight-height` CSS property. To turn off the highlight, set this variable to `0`. For more information on setting CSS properties, see the [theming documentation](/docs/theming/css-variables).

### Highlight Color

The highlight color changes based on the item state, but all of the states use Ionic colors by default. When focused, the input highlight will use the `primary` color. If the input is valid it will use the `success` color, and invalid inputs will use the `danger` color. See the [CSS Custom Properties](#css-custom-properties) section below for the highlight color variables.


<!-- Auto Generated Below -->


## Usage

### Angular

Basic Usage

```html
<!-- Default Item -->
<ion-item>
  <ion-label>
    Item
  </ion-label>
</ion-item>

<!-- Item as a Button -->
<ion-item (click)="buttonClick()">
  <ion-label>
    Button Item
  </ion-label>
</ion-item>

<!-- Item as an Anchor -->
<ion-item href="https://www.ionicframework.com">
  <ion-label>
    Anchor Item
  </ion-label>
</ion-item>

<ion-item color="secondary">
  <ion-label>
    Secondary Color Item
  </ion-label>
</ion-item>
```

Detail Arrows

```html
<ion-item detail>
  <ion-label>
    Standard Item with Detail Arrow
  </ion-label>
</ion-item>

<ion-item (click)="buttonClick()" detail>
  <ion-label>
    Button Item with Detail Arrow
  </ion-label>
</ion-item>

<ion-item detail="false" href="https://www.ionicframework.com">
  <ion-label>
    Anchor Item with no Detail Arrow
  </ion-label>
</ion-item>
```

List Items

```html
<ion-list>
  <ion-item>
    <ion-label>
      Item
    </ion-label>
  </ion-item>

  <ion-item lines="none">
    <ion-label>
      No Lines Item
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-label text-wrap>
    Multiline text that should wrap when it is too long
    to fit on one line in the item.
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-label text-wrap>
      <ion-text color="primary">
        <h3>H3 Primary Title</h3>
      </ion-text>
      <p>Paragraph line 1</p>
      <ion-text color="secondary">
        <p>Paragraph line 2 secondary</p>
      </ion-text>
    </ion-label>
  </ion-item>

  <ion-item lines="full">
    <ion-label>
      Item with Full Lines
    </ion-label>
  </ion-item>

</ion-list>
```

Item Lines

```html
<!-- Item Inset Lines -->
<ion-item lines="inset">
  <ion-label>Item Lines Inset</ion-label>
</ion-item>

<!-- Item Full Lines -->
<ion-item lines="full">
  <ion-label>Item Lines Full</ion-label>
</ion-item>

<!-- Item None Lines -->
<ion-item lines="none">
  <ion-label>Item Lines None</ion-label>
</ion-item>

<!-- List Full Lines -->
<ion-list lines="full">
  <ion-item>
    <ion-label>Full Lines Item 1</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>Full Lines Item 2</ion-label>
  </ion-item>
</ion-list>

<!-- List Inset Lines -->
<ion-list lines="inset">
  <ion-item>
    <ion-label>Inset Lines Item 1</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>Inset Lines Item 2</ion-label>
  </ion-item>
</ion-list>

<!-- List No Lines -->
<ion-list lines="none">
  <ion-item>
    <ion-label>No lines Item 1</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>No lines Item 2</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>No lines Item 3</ion-label>
  </ion-item>
</ion-list>
```


Media Items

```html
<ion-item (click)="testClick()">
  <ion-avatar slot="start">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-avatar>
  <ion-label>
    Avatar Start, Button Item
  </ion-label>
</ion-item>

<ion-item href="#">
  <ion-label>
    Thumbnail End, Anchor Item
  </ion-label>
  <ion-thumbnail slot="end">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-thumbnail>
</ion-item>

<ion-item>
  <ion-thumbnail slot="start">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-thumbnail>
  <ion-label>
    <h2>H2 Title Text</h2>
    <p>Button on right</p>
  </ion-label>
  <ion-button fill="outline" slot="end">View</ion-button>
</ion-item>

<ion-item (click)="testClick()">
  <ion-thumbnail slot="start">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-thumbnail>
  <ion-label>
    <h3>H3 Title Text</h3>
    <p>Icon on right</p>
  </ion-label>
  <ion-icon name="close-circle" slot="end"></ion-icon>
</ion-item>
```

Buttons in Items

```html
<ion-item>
  <ion-button slot="start">
    Start
  </ion-button>
  <ion-label>Button Start/End</ion-label>
  <ion-button slot="end">
    End
  </ion-button>
</ion-item>

<ion-item>
  <ion-button slot="start">
    Start Icon
    <ion-icon name="home" slot="end"></ion-icon>
  </ion-button>
  <ion-label>Buttons with Icons</ion-label>
  <ion-button slot="end">
    <ion-icon name="star" slot="end"></ion-icon>
    End Icon
  </ion-button>
</ion-item>

<ion-item>
  <ion-button slot="start">
    <ion-icon slot="icon-only" name="navigate"></ion-icon>
  </ion-button>
  <ion-label>Icon only Buttons</ion-label>
  <ion-button slot="end">
    <ion-icon slot="icon-only" name="star"></ion-icon>
  </ion-button>
</ion-item>
```

Icons in Items

```html
<ion-item>
  <ion-label>
    Icon End
  </ion-label>
  <ion-icon name="information-circle" slot="end"></ion-icon>
</ion-item>

<ion-item>
  <ion-label>
    Large Icon End
  </ion-label>
  <ion-icon name="information-circle" size="large" slot="end"></ion-icon>
</ion-item>

<ion-item>
  <ion-label>
    Small Icon End
  </ion-label>
  <ion-icon name="information-circle" size="small" slot="end"></ion-icon>
</ion-item>

<ion-item>
  <ion-icon name="star" slot="start"></ion-icon>
  <ion-label>
    Icon Start
  </ion-label>
</ion-item>

<ion-item>
  <ion-label>
    Two Icons End
  </ion-label>
  <ion-icon name="checkmark-circle" slot="end"></ion-icon>
  <ion-icon name="shuffle" slot="end"></ion-icon>
</ion-item>
```

Item Inputs

```html
<ion-item>
  <ion-label position="floating">Datetime</ion-label>
  <ion-datetime></ion-datetime>
</ion-item>

<ion-item>
  <ion-label position="floating">Select</ion-label>
  <ion-select>
    <ion-select-option value="">No Game Console</ion-select-option>
    <ion-select-option value="nes">NES</ion-select-option>
    <ion-select-option value="n64" selected>Nintendo64</ion-select-option>
    <ion-select-option value="ps">PlayStation</ion-select-option>
    <ion-select-option value="genesis">Sega Genesis</ion-select-option>
    <ion-select-option value="saturn">Sega Saturn</ion-select-option>
    <ion-select-option value="snes">SNES</ion-select-option>
  </ion-select>
</ion-item>

<ion-item>
  <ion-label>Toggle</ion-label>
  <ion-toggle slot="end"></ion-toggle>
</ion-item>

<ion-item>
  <ion-label position="floating">Floating Input</ion-label>
  <ion-input></ion-input>
</ion-item>

<ion-item>
  <ion-label>Input (placeholder)</ion-label>
  <ion-input placeholder="Placeholder"></ion-input>
</ion-item>

<ion-item>
  <ion-label>Checkbox</ion-label>
  <ion-checkbox slot="start"></ion-checkbox>
</ion-item>

<ion-item>
  <ion-label>Range</ion-label>
  <ion-range></ion-range>
</ion-item>
```


### Javascript

Basic Usage

```html
<!-- Default Item -->
<ion-item>
  <ion-label>
    Item
  </ion-label>
</ion-item>

<!-- Item as a Button -->
<ion-item onclick="buttonClick()">
  <ion-label>
    Button Item
  </ion-label>
</ion-item>

<!-- Item as an Anchor -->
<ion-item href="https://www.ionicframework.com">
  <ion-label>
    Anchor Item
  </ion-label>
</ion-item>

<ion-item color="secondary">
  <ion-label>
    Secondary Color Item
  </ion-label>
</ion-item>
```

Detail Arrows

```html
<ion-item detail>
  <ion-label>
    Standard Item with Detail Arrow
  </ion-label>
</ion-item>

<ion-item onclick="buttonClick()" detail>
  <ion-label>
    Button Item with Detail Arrow
  </ion-label>
</ion-item>

<ion-item detail="false" href="https://www.ionicframework.com">
  <ion-label>
    Anchor Item with no Detail Arrow
  </ion-label>
</ion-item>
```

List Items

```html
<ion-list>
  <ion-item>
    <ion-label>
      Item
    </ion-label>
  </ion-item>

  <ion-item lines="none">
    <ion-label>
      No Lines Item
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-label text-wrap>
    Multiline text that should wrap when it is too long
    to fit on one line in the item.
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-label text-wrap>
      <ion-text color="primary">
        <h3>H3 Primary Title</h3>
      </ion-text>
      <p>Paragraph line 1</p>
      <ion-text color="secondary">
        <p>Paragraph line 2 secondary</p>
      </ion-text>
    </ion-label>
  </ion-item>

  <ion-item lines="full">
    <ion-label>
      Item with Full Lines
    </ion-label>
  </ion-item>

</ion-list>
```

Item Lines

```html
<!-- Item Inset Lines -->
<ion-item lines="inset">
  <ion-label>Item Lines Inset</ion-label>
</ion-item>

<!-- Item Full Lines -->
<ion-item lines="full">
  <ion-label>Item Lines Full</ion-label>
</ion-item>

<!-- Item None Lines -->
<ion-item lines="none">
  <ion-label>Item Lines None</ion-label>
</ion-item>

<!-- List Full Lines -->
<ion-list lines="full">
  <ion-item>
    <ion-label>Full Lines Item 1</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>Full Lines Item 2</ion-label>
  </ion-item>
</ion-list>

<!-- List Inset Lines -->
<ion-list lines="inset">
  <ion-item>
    <ion-label>Inset Lines Item 1</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>Inset Lines Item 2</ion-label>
  </ion-item>
</ion-list>

<!-- List No Lines -->
<ion-list lines="none">
  <ion-item>
    <ion-label>No lines Item 1</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>No lines Item 2</ion-label>
  </ion-item>

  <ion-item>
    <ion-label>No lines Item 3</ion-label>
  </ion-item>
</ion-list>
```


Media Items

```html
<ion-item onclick="testClick()">
  <ion-avatar slot="start">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-avatar>
  <ion-label>
    Avatar Start, Button Item
  </ion-label>
</ion-item>

<ion-item href="#">
  <ion-label>
    Thumbnail End, Anchor Item
  </ion-label>
  <ion-thumbnail slot="end">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-thumbnail>
</ion-item>

<ion-item>
  <ion-thumbnail slot="start">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-thumbnail>
  <ion-label>
    <h2>H2 Title Text</h2>
    <p>Button on right</p>
  </ion-label>
  <ion-button fill="outline" slot="end">View</ion-button>
</ion-item>

<ion-item onclick="testClick()">
  <ion-thumbnail slot="start">
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
  </ion-thumbnail>
  <ion-label>
    <h3>H3 Title Text</h3>
    <p>Icon on right</p>
  </ion-label>
  <ion-icon name="close-circle" slot="end"></ion-icon>
</ion-item>
```

Buttons in Items

```html
<ion-item>
  <ion-button slot="start">
    Start
  </ion-button>
  <ion-label>Button Start/End</ion-label>
  <ion-button slot="end">
    End
  </ion-button>
</ion-item>

<ion-item>
  <ion-button slot="start">
    Start Icon
    <ion-icon name="home" slot="end"></ion-icon>
  </ion-button>
  <ion-label>Buttons with Icons</ion-label>
  <ion-button slot="end">
    <ion-icon name="star" slot="end"></ion-icon>
    End Icon
  </ion-button>
</ion-item>

<ion-item>
  <ion-button slot="start">
    <ion-icon slot="icon-only" name="navigate"></ion-icon>
  </ion-button>
  <ion-label>Icon only Buttons</ion-label>
  <ion-button slot="end">
    <ion-icon slot="icon-only" name="star"></ion-icon>
  </ion-button>
</ion-item>
```

Icons in Items

```html
<ion-item>
  <ion-label>
    Icon End
  </ion-label>
  <ion-icon name="information-circle" slot="end"></ion-icon>
</ion-item>

<ion-item>
  <ion-label>
    Large Icon End
  </ion-label>
  <ion-icon name="information-circle" size="large" slot="end"></ion-icon>
</ion-item>

<ion-item>
  <ion-label>
    Small Icon End
  </ion-label>
  <ion-icon name="information-circle" size="small" slot="end"></ion-icon>
</ion-item>

<ion-item>
  <ion-icon name="star" slot="start"></ion-icon>
  <ion-label>
    Icon Start
  </ion-label>
</ion-item>

<ion-item>
  <ion-label>
    Two Icons End
  </ion-label>
  <ion-icon name="checkmark-circle" slot="end"></ion-icon>
  <ion-icon name="shuffle" slot="end"></ion-icon>
</ion-item>
```

Item Inputs

```html
<ion-item>
  <ion-label position="floating">Datetime</ion-label>
  <ion-datetime></ion-datetime>
</ion-item>

<ion-item>
  <ion-label position="floating">Select</ion-label>
  <ion-select>
    <ion-select-option value="">No Game Console</ion-select-option>
    <ion-select-option value="nes">NES</ion-select-option>
    <ion-select-option value="n64" selected>Nintendo64</ion-select-option>
    <ion-select-option value="ps">PlayStation</ion-select-option>
    <ion-select-option value="genesis">Sega Genesis</ion-select-option>
    <ion-select-option value="saturn">Sega Saturn</ion-select-option>
    <ion-select-option value="snes">SNES</ion-select-option>
  </ion-select>
</ion-item>

<ion-item>
  <ion-label>Toggle</ion-label>
  <ion-toggle slot="end"></ion-toggle>
</ion-item>

<ion-item>
  <ion-label position="floating">Floating Input</ion-label>
  <ion-input></ion-input>
</ion-item>

<ion-item>
  <ion-label>Input (placeholder)</ion-label>
  <ion-input placeholder="Placeholder"></ion-input>
</ion-item>

<ion-item>
  <ion-label>Checkbox</ion-label>
  <ion-checkbox slot="start"></ion-checkbox>
</ion-item>

<ion-item>
  <ion-label>Range</ion-label>
  <ion-range></ion-range>
</ion-item>
```


### React

```tsx
import React from 'react';

import { IonItem, IonLabel, IonList, IonText, IonAvatar, IonThumbnail, IonButton, IonIcon, IonSelect, IonSelectOption, IonDatetime, IonToggle, IonInput, IonCheckbox, IonRange } from '@ionic/react';

const Example: React.FunctionComponent<{}> = () => (
  <>
    {/*-- Default Item --*/}
    <IonItem>
      <IonLabel>
        Item
      </IonLabel>
    </IonItem>

    {/*-- Item as a Button --*/}
    <IonItem onClick={() => {}}>
      <IonLabel>
        Button Item
      </IonLabel>
    </IonItem>

    {/*-- Item as an Anchor --*/}
    <IonItem href="https://www.ionicframework.com">
      <IonLabel>
        Anchor Item
      </IonLabel>
    </IonItem>

    <IonItem color="secondary">
      <IonLabel>
        Secondary Color Item
      </IonLabel>
    </IonItem>

    {/*-- Detail Arrows --*/}

    <IonItem detail>
      <IonLabel>
        Standard Item with Detail Arrow
      </IonLabel>
    </IonItem>

    <IonItem onClick={() => {}} detail>
      <IonLabel>
        Button Item with Detail Arrow
      </IonLabel>
    </IonItem>

    <IonItem detail={false} href="https://www.ionicframework.com">
      <IonLabel>
        Anchor Item with no Detail Arrow
      </IonLabel>
    </IonItem>


    <IonList>
      <IonItem>
        <IonLabel>
          Item
        </IonLabel>
      </IonItem>

      <IonItem lines="none">
        <IonLabel>
          No Lines Item
        </IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel text-wrap>
        Multiline text that should wrap when it is too long
        to fit on one line in the item.
        </IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel text-wrap>
          <IonText color="primary">
            <h3>H3 Primary Title</h3>
          </IonText>
          <p>Paragraph line 1</p>
          <IonText color="secondary">
            <p>Paragraph line 2 secondary</p>
          </IonText>
        </IonLabel>
      </IonItem>

      <IonItem lines="full">
        <IonLabel>
          Item with Full Lines
        </IonLabel>
      </IonItem>

    </IonList>


    {/*-- Item Inset Lines --*/}
    <IonItem lines="inset">
      <IonLabel>Item Lines Inset</IonLabel>
    </IonItem>

    {/*-- Item Full Lines --*/}
    <IonItem lines="full">
      <IonLabel>Item Lines Full</IonLabel>
    </IonItem>

    {/*-- Item None Lines --*/}
    <IonItem lines="none">
      <IonLabel>Item Lines None</IonLabel>
    </IonItem>

    {/*-- List Full Lines --*/}
    <IonList lines="full">
      <IonItem>
        <IonLabel>Full Lines Item 1</IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel>Full Lines Item 2</IonLabel>
      </IonItem>
    </IonList>

    {/*-- List Inset Lines --*/}
    <IonList lines="inset">
      <IonItem>
        <IonLabel>Inset Lines Item 1</IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel>Inset Lines Item 2</IonLabel>
      </IonItem>
    </IonList>

    {/*-- List No Lines --*/}
    <IonList lines="none">
      <IonItem>
        <IonLabel>No lines Item 1</IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel>No lines Item 2</IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel>No lines Item 3</IonLabel>
      </IonItem>
    </IonList>



    <IonItem onClick={() => {}}>
      <IonAvatar slot="start">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==" />
      </IonAvatar>
      <IonLabel>
        Avatar Start, Button Item
      </IonLabel>
    </IonItem>

    <IonItem href="#">
      <IonLabel>
        Thumbnail End, Anchor Item
      </IonLabel>
      <IonThumbnail slot="end">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==" />
      </IonThumbnail>
    </IonItem>

    <IonItem>
      <IonThumbnail slot="start">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==" />
      </IonThumbnail>
      <IonLabel>
        <h2>H2 Title Text</h2>
        <p>Button on right</p>
      </IonLabel>
      <IonButton fill="outline" slot="end">View</IonButton>
    </IonItem>

    <IonItem onClick={() => {}}>
      <IonThumbnail slot="start">
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==" />
      </IonThumbnail>
      <IonLabel>
        <h3>H3 Title Text</h3>
        <p>Icon on right</p>
      </IonLabel>
      <IonIcon name="close-circle" slot="end" />
    </IonItem>


    Buttons in Items


    <IonItem>
      <IonButton slot="start">
        Start
      </IonButton>
      <IonLabel>Button Start/End</IonLabel>
      <IonButton slot="end">
        End
      </IonButton>
    </IonItem>

    <IonItem>
      <IonButton slot="start">
        Start Icon
        <IonIcon name="home" slot="end" />
      </IonButton>
      <IonLabel>Buttons with Icons</IonLabel>
      <IonButton slot="end">
        <IonIcon name="star" slot="end" />
        End Icon
      </IonButton>
    </IonItem>

    <IonItem>
      <IonButton slot="start">
        <IonIcon slot="icon-only" name="navigate" />
      </IonButton>
      <IonLabel>Icon only Buttons</IonLabel>
      <IonButton slot="end">
        <IonIcon slot="icon-only" name="star" />
      </IonButton>
    </IonItem>


    <IonItem>
      <IonLabel>
        Icon End
      </IonLabel>
      <IonIcon name="information-circle" slot="end" />
    </IonItem>

    <IonItem>
      <IonLabel>
        Large Icon End
      </IonLabel>
      <IonIcon name="information-circle" size="large" slot="end" />
    </IonItem>

    <IonItem>
      <IonLabel>
        Small Icon End
      </IonLabel>
      <IonIcon name="information-circle" size="small" slot="end" />
    </IonItem>

    <IonItem>
      <IonIcon name="star" slot="start" />
      <IonLabel>
        Icon Start
      </IonLabel>
    </IonItem>

    <IonItem>
      <IonLabel>
        Two Icons End
      </IonLabel>
      <IonIcon name="checkmark-circle" slot="end" />
      <IonIcon name="shuffle" slot="end" />
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Datetime</IonLabel>
      <IonDatetime></IonDatetime>
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Select</IonLabel>
      <IonSelect>
        <IonSelectOption value="">No Game Console</IonSelectOption>
        <IonSelectOption value="nes">NES</IonSelectOption>
        <IonSelectOption value="n64" selected>Nintendo64</IonSelectOption>
        <IonSelectOption value="ps">PlayStation</IonSelectOption>
        <IonSelectOption value="genesis">Sega Genesis</IonSelectOption>
        <IonSelectOption value="saturn">Sega Saturn</IonSelectOption>
        <IonSelectOption value="snes">SNES</IonSelectOption>
      </IonSelect>
    </IonItem>

    <IonItem>
      <IonLabel>Toggle</IonLabel>
      <IonToggle slot="end"></IonToggle>
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Floating Input</IonLabel>
      <IonInput></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel>Input (placeholder)</IonLabel>
      <IonInput placeholder="Placeholder"></IonInput>
    </IonItem>

    <IonItem>
      <IonLabel>Checkbox</IonLabel>
      <IonCheckbox slot="start" />
    </IonItem>

    <IonItem>
      <IonLabel>Range</IonLabel>
      <IonRange></IonRange>
    </IonItem>
  </>
);

export default Example;
```


### Vue

Basic Usage

```html
<template>
  <!-- Default Item -->
  <ion-item>
    <ion-label>
      Item
    </ion-label>
  </ion-item>

  <!-- Item as a Button -->
  <ion-item @click="buttonClick()">
    <ion-label>
      Button Item
    </ion-label>
  </ion-item>

  <!-- Item as an Anchor -->
  <ion-item href="https://www.ionicframework.com">
    <ion-label>
      Anchor Item
    </ion-label>
  </ion-item>

  <ion-item color="secondary">
    <ion-label>
      Secondary Color Item
    </ion-label>
  </ion-item>
</template>
```

Detail Arrows

```html
<template>
  <ion-item detail>
    <ion-label>
      Standard Item with Detail Arrow
    </ion-label>
  </ion-item>

  <ion-item @click="buttonClick()" detail>
    <ion-label>
      Button Item with Detail Arrow
    </ion-label>
  </ion-item>

  <ion-item detail="false" href="https://www.ionicframework.com">
    <ion-label>
      Anchor Item with no Detail Arrow
    </ion-label>
  </ion-item>
</template>
```

List Items

```html
<template>
  <ion-list>
    <ion-item>
      <ion-label>
        Item
      </ion-label>
    </ion-item>

    <ion-item lines="none">
      <ion-label>
        No Lines Item
      </ion-label>
    </ion-item>

    <ion-item>
      <ion-label text-wrap>
      Multiline text that should wrap when it is too long
      to fit on one line in the item.
      </ion-label>
    </ion-item>

    <ion-item>
      <ion-label text-wrap>
        <ion-text color="primary">
          <h3>H3 Primary Title</h3>
        </ion-text>
        <p>Paragraph line 1</p>
        <ion-text color="secondary">
          <p>Paragraph line 2 secondary</p>
        </ion-text>
      </ion-label>
    </ion-item>

    <ion-item lines="full">
      <ion-label>
        Item with Full Lines
      </ion-label>
    </ion-item>

  </ion-list>
</template>
```

Item Lines

```html
<template>
  <!-- Item Inset Lines -->
  <ion-item lines="inset">
    <ion-label>Item Lines Inset</ion-label>
  </ion-item>

  <!-- Item Full Lines -->
  <ion-item lines="full">
    <ion-label>Item Lines Full</ion-label>
  </ion-item>

  <!-- Item None Lines -->
  <ion-item lines="none">
    <ion-label>Item Lines None</ion-label>
  </ion-item>

  <!-- List Full Lines -->
  <ion-list lines="full">
    <ion-item>
      <ion-label>Full Lines Item 1</ion-label>
    </ion-item>

    <ion-item>
      <ion-label>Full Lines Item 2</ion-label>
    </ion-item>
  </ion-list>

  <!-- List Inset Lines -->
  <ion-list lines="inset">
    <ion-item>
      <ion-label>Inset Lines Item 1</ion-label>
    </ion-item>

    <ion-item>
      <ion-label>Inset Lines Item 2</ion-label>
    </ion-item>
  </ion-list>

  <!-- List No Lines -->
  <ion-list lines="none">
    <ion-item>
      <ion-label>No lines Item 1</ion-label>
    </ion-item>

    <ion-item>
      <ion-label>No lines Item 2</ion-label>
    </ion-item>

    <ion-item>
      <ion-label>No lines Item 3</ion-label>
    </ion-item>
  </ion-list>
</template>
```


Media Items

```html
<template>
  <ion-item @click="testClick()">
    <ion-avatar slot="start">
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
    </ion-avatar>
    <ion-label>
      Avatar Start, Button Item
    </ion-label>
  </ion-item>

  <ion-item href="#">
    <ion-label>
      Thumbnail End, Anchor Item
    </ion-label>
    <ion-thumbnail slot="end">
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
    </ion-thumbnail>
  </ion-item>

  <ion-item>
    <ion-thumbnail slot="start">
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
    </ion-thumbnail>
    <ion-label>
      <h2>H2 Title Text</h2>
      <p>Button on right</p>
    </ion-label>
    <ion-button fill="outline" slot="end">View</ion-button>
  </ion-item>

  <ion-item @click="testClick()">
    <ion-thumbnail slot="start">
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
    </ion-thumbnail>
    <ion-label>
      <h3>H3 Title Text</h3>
      <p>Icon on right</p>
    </ion-label>
    <ion-icon name="close-circle" slot="end"></ion-icon>
  </ion-item>
</template>
```

Buttons in Items

```html
<template>
  <ion-item>
    <ion-button slot="start">
      Start
    </ion-button>
    <ion-label>Button Start/End</ion-label>
    <ion-button slot="end">
      End
    </ion-button>
  </ion-item>

  <ion-item>
    <ion-button slot="start">
      Start Icon
      <ion-icon name="home" slot="end"></ion-icon>
    </ion-button>
    <ion-label>Buttons with Icons</ion-label>
    <ion-button slot="end">
      <ion-icon name="star" slot="end"></ion-icon>
      End Icon
    </ion-button>
  </ion-item>

  <ion-item>
    <ion-button slot="start">
      <ion-icon slot="icon-only" name="navigate"></ion-icon>
    </ion-button>
    <ion-label>Icon only Buttons</ion-label>
    <ion-button slot="end">
      <ion-icon slot="icon-only" name="star"></ion-icon>
    </ion-button>
  </ion-item>
</template>
```

Icons in Items

```html
<template>
  <ion-item>
    <ion-label>
      Icon End
    </ion-label>
    <ion-icon name="information-circle" slot="end"></ion-icon>
  </ion-item>

  <ion-item>
    <ion-label>
      Large Icon End
    </ion-label>
    <ion-icon name="information-circle" size="large" slot="end"></ion-icon>
  </ion-item>

  <ion-item>
    <ion-label>
      Small Icon End
    </ion-label>
    <ion-icon name="information-circle" size="small" slot="end"></ion-icon>
  </ion-item>

  <ion-item>
    <ion-icon name="star" slot="start"></ion-icon>
    <ion-label>
      Icon Start
    </ion-label>
  </ion-item>

  <ion-item>
    <ion-label>
      Two Icons End
    </ion-label>
    <ion-icon name="checkmark-circle" slot="end"></ion-icon>
    <ion-icon name="shuffle" slot="end"></ion-icon>
  </ion-item>
</template>
```

Item Inputs

```html
<template>
  <ion-item>
    <ion-label position="floating">Datetime</ion-label>
    <ion-datetime></ion-datetime>
  </ion-item>

  <ion-item>
    <ion-label position="floating">Select</ion-label>
    <ion-select>
      <ion-select-option value="">No Game Console</ion-select-option>
      <ion-select-option value="nes">NES</ion-select-option>
      <ion-select-option value="n64" selected>Nintendo64</ion-select-option>
      <ion-select-option value="ps">PlayStation</ion-select-option>
      <ion-select-option value="genesis">Sega Genesis</ion-select-option>
      <ion-select-option value="saturn">Sega Saturn</ion-select-option>
      <ion-select-option value="snes">SNES</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item>
    <ion-label>Toggle</ion-label>
    <ion-toggle slot="end"></ion-toggle>
  </ion-item>

  <ion-item>
    <ion-label position="floating">Floating Input</ion-label>
    <ion-input></ion-input>
  </ion-item>

  <ion-item>
    <ion-label>Input (placeholder)</ion-label>
    <ion-input placeholder="Placeholder"></ion-input>
  </ion-item>

  <ion-item>
    <ion-label>Checkbox</ion-label>
    <ion-checkbox slot="start"></ion-checkbox>
  </ion-item>

  <ion-item>
    <ion-label>Range</ion-label>
    <ion-range></ion-range>
  </ion-item>
</template>
```



## Properties

| Property          | Attribute          | Description                                                                                                                                                                                                                                                                               | Type                                       | Default               |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------- |
| `button`          | `button`           | If `true`, a button tag will be rendered and the item will be tappable.                                                                                                                                                                                                                   | `boolean`                                  | `false`               |
| `color`           | `color`            | The color to use from your application's color palette. Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`. For more information on colors, see [theming](/docs/theming/basics).                    | `string \| undefined`                      | `undefined`           |
| `detail`          | `detail`           | If `true`, a detail arrow will appear on the item. Defaults to `false` unless the `mode` is `ios` and an `href` or `button` property is present.                                                                                                                                          | `boolean \| undefined`                     | `undefined`           |
| `detailIcon`      | `detail-icon`      | The icon to use when `detail` is set to `true`.                                                                                                                                                                                                                                           | `string`                                   | `'ios-arrow-forward'` |
| `disabled`        | `disabled`         | If `true`, the user cannot interact with the item.                                                                                                                                                                                                                                        | `boolean`                                  | `false`               |
| `download`        | `download`         | This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). | `string \| undefined`                      | `undefined`           |
| `href`            | `href`             | Contains a URL or a URL fragment that the hyperlink points to. If this property is set, an anchor tag will be rendered.                                                                                                                                                                   | `string \| undefined`                      | `undefined`           |
| `lines`           | `lines`            | How the bottom border should be displayed on the item.                                                                                                                                                                                                                                    | `"full" \| "inset" \| "none" \| undefined` | `undefined`           |
| `mode`            | `mode`             | The mode determines which platform styles to use.                                                                                                                                                                                                                                         | `"ios" \| "md"`                            | `undefined`           |
| `rel`             | `rel`              | Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).                                                                                                    | `string \| undefined`                      | `undefined`           |
| `routerDirection` | `router-direction` | When using a router, it specifies the transition direction when navigating to another page using `href`.                                                                                                                                                                                  | `"back" \| "forward" \| "root"`            | `'forward'`           |
| `target`          | `target`           | Specifies where to display the linked URL. Only applies when an `href` is provided. Special keywords: `"_blank"`, `"_self"`, `"_parent"`, `"_top"`.                                                                                                                                       | `string \| undefined`                      | `undefined`           |
| `type`            | `type`             | The type of the button. Only used when an `onclick` or `button` property is present.                                                                                                                                                                                                      | `"button" \| "reset" \| "submit"`          | `'button'`            |


## Slots

| Slot      | Description                                                                     |
| --------- | ------------------------------------------------------------------------------- |
|           | Content is placed between the named slots if provided without a slot.           |
| `"end"`   | Content is placed to the right of the item text in LTR, and to the left in RTL. |
| `"start"` | Content is placed to the left of the item text in LTR, and to the right in RTL. |


## CSS Custom Properties

| Name                        | Description                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `--background`              | Background of the item                                                                                        |
| `--background-activated`    | Background of the item when pressed                                                                           |
| `--background-focused`      | Background of the item when focused with the tab key                                                          |
| `--background-hover`        | Background of the item on hover                                                                               |
| `--border-color`            | Color of the item border                                                                                      |
| `--border-radius`           | Radius of the item border                                                                                     |
| `--border-style`            | Style of the item border                                                                                      |
| `--border-width`            | Width of the item border                                                                                      |
| `--box-shadow`              | Box shadow of the item                                                                                        |
| `--color`                   | Color of the item                                                                                             |
| `--color-activated`         | Color of the item when pressed                                                                                |
| `--color-focused`           | Color of the item when focused with the tab key                                                               |
| `--color-hover`             | Color of the item on hover                                                                                    |
| `--detail-icon-color`       | Color of the item detail icon                                                                                 |
| `--detail-icon-font-size`   | Font size of the item detail icon                                                                             |
| `--detail-icon-opacity`     | Opacity of the item detail icon                                                                               |
| `--highlight-color-focused` | The color of the highlight on the item when focused                                                           |
| `--highlight-color-invalid` | The color of the highlight on the item when invalid                                                           |
| `--highlight-color-valid`   | The color of the highlight on the item when valid                                                             |
| `--highlight-height`        | The height of the highlight on the item                                                                       |
| `--inner-border-width`      | Width of the item inner border                                                                                |
| `--inner-box-shadow`        | Box shadow of the item inner                                                                                  |
| `--inner-padding-bottom`    | Bottom padding of the item inner                                                                              |
| `--inner-padding-end`       | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the item inner |
| `--inner-padding-start`     | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the item inner |
| `--inner-padding-top`       | Top padding of the item inner                                                                                 |
| `--min-height`              | Minimum height of the item                                                                                    |
| `--padding-bottom`          | Bottom padding of the item                                                                                    |
| `--padding-end`             | Right padding if direction is left-to-right, and left padding if direction is right-to-left of the item       |
| `--padding-start`           | Left padding if direction is left-to-right, and right padding if direction is right-to-left of the item       |
| `--padding-top`             | Top padding of the item                                                                                       |
| `--ripple-color`            | Color of the item ripple effect                                                                               |
| `--transition`              | Transition of the item                                                                                        |


## Dependencies

### Used by

 - ion-select-popover

### Depends on

- ion-icon
- [ion-ripple-effect](../ripple-effect)

### Graph
```mermaid
graph TD;
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-select-popover --> ion-item
  style ion-item fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
