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
