import React, { useState, ReactElement } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterOutlet,
} from '@ionic/react';
import { Route, Redirect } from 'react-router';
import { Link } from 'react-router-dom';

const DynamicRoutes: React.FC = () => {
  const [routes, setRoutes] = useState<ReactElement[]>([
    <Route
      key="sldjflsdj"
      path="/dynamic-routes/home"
      render={() => <Home update={addRoute} />}
      exact={true}
    />,
  ]);

  const addRoute = () => {
    const newRoute = (
      <Route key="lsdjldj" path="/dynamic-routes/newRoute" component={NewRoute} exact={true} />
    );
    setRoutes([...routes, newRoute]);
  };

  return (
    <IonRouterOutlet>
      {routes}
      {/* <Route exact path="/home" render={() => <Home update={addRoute} />} /> */}
      <Route exact path="/dynamic-routes" render={() => <Redirect to="/dynamic-routes/home" />} />
      <Route render={() => <Failed />} />
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
