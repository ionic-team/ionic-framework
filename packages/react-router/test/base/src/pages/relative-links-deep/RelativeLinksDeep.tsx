import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { Link, Route, useParams, useResolvedPath } from 'react-router-dom';

import TestDescription from '../../components/TestDescription';

/**
 * This test page verifies that a relative `to` resolves to an absolute app path
 * inside a multi-segment relative route and inside a splat route.
 */

const Home: React.FC = () => (
  <IonPage data-pageid="relative-links-deep-home">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/" />
        </IonButtons>
        <IonTitle>Relative Links (deep route)</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem routerLink="/relative-links-deep/group/item/5">
          <IonLabel>Go to item 5</IonLabel>
        </IonItem>
        <IonItem routerLink="/relative-links-deep/files/docs/readme">
          <IonLabel>Go to files (splat)</IonLabel>
        </IonItem>
      </IonList>
      <TestDescription>
        Open item 5 and tap the relative link. The URL should be /relative-links-deep/group/item/5/sibling.
        Open files and check the resolved path is /relative-links-deep/files/edit, which excludes the splat's
        matched tail.
      </TestDescription>
    </IonContent>
  </IonPage>
);

const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const resolved = useResolvedPath('sibling');

  return (
    <IonPage data-pageid="relative-links-deep-item">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/relative-links-deep" />
          </IonButtons>
          <IonTitle>Item {id}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="resolved-path">{resolved.pathname}</div>
        <Link to="sibling" data-testid="relative-link">
          Relative link to sibling
        </Link>
      </IonContent>
    </IonPage>
  );
};

const SiblingPage: React.FC = () => (
  <IonPage data-pageid="relative-links-deep-sibling">
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton defaultHref="/relative-links-deep" />
        </IonButtons>
        <IonTitle>Sibling</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <div data-testid="sibling-content">Reached the sibling page</div>
    </IonContent>
  </IonPage>
);

const FilesPage: React.FC = () => {
  const resolved = useResolvedPath('edit');

  return (
    <IonPage data-pageid="relative-links-deep-files">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/relative-links-deep" />
          </IonButtons>
          <IonTitle>Files</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div data-testid="files-resolved-path">{resolved.pathname}</div>
      </IonContent>
    </IonPage>
  );
};

const RelativeLinksDeep: React.FC = () => (
  <IonRouterOutlet>
    <Route path="group/item/:id" element={<ItemPage />} />
    <Route path="group/item/:id/sibling" element={<SiblingPage />} />
    <Route path="files/*" element={<FilesPage />} />
    <Route path="" element={<Home />} />
  </IonRouterOutlet>
);

export default RelativeLinksDeep;
