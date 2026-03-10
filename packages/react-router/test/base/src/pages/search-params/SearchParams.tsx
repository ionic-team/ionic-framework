import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const SearchParams: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <IonPage data-pageid="search-params">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Search Params</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div id="current-path">{location.pathname + location.search}</div>
        <div id="query-value">{query}</div>
        <IonButton id="add-search" onClick={() => navigate('/search-params?q=test')}>
          Add Search Param
        </IonButton>
        <IonButton id="change-search" onClick={() => navigate('/search-params?q=changed')}>
          Change Search Param
        </IonButton>
        <IonButton id="remove-search" onClick={() => navigate('/search-params')}>
          Remove Search Param
        </IonButton>
        <IonButton id="go-home" routerLink="/">
          Go Home
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SearchParams;
