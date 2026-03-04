import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
} from '@ionic/react';
import React, { useState } from 'react';
import type { ReactElement } from 'react';
import { Route, Navigate } from 'react-router';
import { Link } from 'react-router-dom';

const DynamicRoutes: React.FC = () => {
  const addRoute = () => {
    const newRoute = (
      <Route key="lsdjldj" path="/dynamic-routes/newRoute" element={<NewRoute />} />
    );
    setRoutes([...routes, newRoute]);
  };

  const [routes, setRoutes] = useState<ReactElement[]>([
    <Route
      key="sldjflsdj"
      path="/dynamic-routes/home"
      element={<Home update={addRoute} />}
    />,
  ]);

  return (
    <IonRouterOutlet>
      {routes}
      <Route path="/dynamic-routes" element={<Navigate to="/dynamic-routes/home" replace />} />
      <Route element={<Failed />} />
    </IonRouterOutlet>
  );
};

export default DynamicRoutes;

const Home: React.FC<{
  update: Function;
}> = (props) => {
  const updateRoute = () => {
    props.update();
  };

  return (
    <IonPage data-pageid="dynamic-routes-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>HOME</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">HOME</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="container">
          <strong>Click Add Route Button</strong>
          <br />
          <button className="" onClick={() => updateRoute()}>
            Add Route
          </button>
          <br />
          <Link to="/dynamic-routes/newRoute">Take me to the newRoute</Link>
        </div>
      </IonContent>
    </IonPage>
  );
};

const NewRoute: React.FC = () => {
  return (
    <IonPage data-pageid="dynamic-routes-newroute">
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Route</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">New Route</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

const Failed: React.FC = () => {
  return (
    <IonPage data-pageid="dynamic-routes-failed">
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Route Failed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">New Route Failed</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};
