import React, { useRef } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Route } from "react-router";

interface RefsProps {}

const Refs: React.FC = () => {
  return (
    <IonRouterOutlet>
      {/* <Route exact path="/home" render={() => <Home update={addRoute} />} /> */}
      <Route exact path="/refs" component={RefsFC} />
      <Route exact path="/refs/class" component={RefsClass} />
    </IonRouterOutlet>
  );
};

const RefsFC: React.FC<RefsProps> = () => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  return (
    <IonPage data-pageid="refs-fc">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Refs FC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className="ref-test"></IonContent>
    </IonPage>
  );
};

class RefsClass extends React.Component {
  ref = React.createRef<HTMLIonContentElement>();
  render() {
    return (
      <IonPage data-pageid="refs-class">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Refs Class</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent ref={this.ref} className="ref-test"></IonContent>
      </IonPage>
    );
  }
}

export default Refs;
