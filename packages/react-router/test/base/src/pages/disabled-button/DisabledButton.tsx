import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

/**
 * FW-7393: `<IonButton disabled={false}>` must not render a `disabled="false"`
 * attribute on the host. ion-button is a routing-wrapped component
 * (createRoutingComponent), so this validates the fix end-to-end with a real
 * component in a real browser.
 */
const DisabledButton: React.FC = () => {
  const [toggleDisabled, setToggleDisabled] = useState(false);

  return (
    <IonPage data-pageid="disabled-button">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Disabled Button</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="btn-false" disabled={false}>
          disabled false
        </IonButton>

        <IonButton id="btn-true" disabled={true}>
          disabled true
        </IonButton>

        <IonButton id="btn-aria" aria-expanded={false}>
          aria-expanded false
        </IonButton>

        <IonButton id="btn-toggle" disabled={toggleDisabled}>
          toggle target
        </IonButton>

        <IonButton id="btn-do-toggle" onClick={() => setToggleDisabled((v) => !v)}>
          toggle
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DisabledButton;
