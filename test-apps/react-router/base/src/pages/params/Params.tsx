import React from 'react';
import {
  IonButtons,
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';

interface PageProps
extends RouteComponentProps<{
  id: string;
}> {}


const Page: React.FC<PageProps> = ({ match }) => {
  const parseID = parseInt(match.params.id);
  return (
    <IonPage data-pageid={'params-' + match.params.id }>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Params { match.params.id }</IonTitle>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton id="next-page" routerLink={'/params/' + (parseID + 1) } >Go to next param</IonButton>
        <br />
        Page ID: { match.params.id }
      </IonContent>
    </IonPage>
  );
};

export default Page;
