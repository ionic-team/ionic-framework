import {
  IonRouterOutlet,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import React from 'react';
import { Route } from 'react-router';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Test scenarios for issue #27900:
 * Swipe back gesture breaks when navigating between parameterized routes.
 *
 * Reproduction A: /user/alex -> /middle -> /user/sean -> swipe back -> swipe back (broken)
 * Reproduction B: /item/one -> replace /item/two -> /item/two/details -> swipe back (broken)
 */

// --- Reproduction A ---
export const ParamSwipeBack: React.FC = () => {
  return (
    <IonRouterOutlet id="param-swipe-back">
      <Route path="/param-swipe-back" element={<Start />} />
      <Route path="/param-swipe-back/user/:name" element={<UserPage />} />
      <Route path="/param-swipe-back/middle" element={<MiddlePage />} />
    </IonRouterOutlet>
  );
};

const Start: React.FC = () => {
  return (
    <IonPage data-pageid="psb-start">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Param Swipe Back</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem routerLink="/param-swipe-back/user/alex" id="go-to-alex">
          Go to User Alex
        </IonItem>
        <IonItem routerLink="/param-swipe-back/user/sean" id="go-to-sean">
          Go to User Sean
        </IonItem>
        <IonItem routerLink="/param-swipe-back/middle" id="go-to-middle">
          Go to Middle
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

const UserPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonPage data-pageid={`psb-user-${name}`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>User {name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>User: {name}</div>
        <IonItem routerLink="/param-swipe-back/middle" id="go-to-middle">
          Go to Middle
        </IonItem>
        <IonItem routerLink="/param-swipe-back/user/alex" id="go-to-alex">
          Go to User Alex
        </IonItem>
        <IonItem routerLink="/param-swipe-back/user/sean" id="go-to-sean">
          Go to User Sean
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

const MiddlePage: React.FC = () => {
  return (
    <IonPage data-pageid="psb-middle">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Middle Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Middle Page</div>
        <IonItem routerLink="/param-swipe-back/user/alex" id="go-to-alex">
          Go to User Alex
        </IonItem>
        <IonItem routerLink="/param-swipe-back/user/sean" id="go-to-sean">
          Go to User Sean
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

// --- Reproduction B ---
export const ParamSwipeBackB: React.FC = () => {
  return (
    <IonRouterOutlet id="param-swipe-back-b">
      <Route path="/param-swipe-back-b/item/:name" element={<ItemPage />} />
      <Route path="/param-swipe-back-b/item/:name/details" element={<ItemDetails />} />
    </IonRouterOutlet>
  );
};

const ItemPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  return (
    <IonPage data-pageid={`psb-item-${name}`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Item {name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Item: {name}</div>
        <IonButton id="replace-with-two" onClick={() => navigate('/param-swipe-back-b/item/two', { replace: true })}>
          Replace with /item/two
        </IonButton>
        <IonItem routerLink={`/param-swipe-back-b/item/${name}/details`} id="go-to-details">
          Go to Details
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

const ItemDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonPage data-pageid={`psb-item-${name}-details`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Details for {name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>Details for item: {name}</div>
      </IonContent>
    </IonPage>
  );
};
