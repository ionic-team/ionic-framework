import React from 'react';
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton} from '@ionic/react';

const Tab1: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 1</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Tab 1</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <h1>Tab1</h1>
                <IonButton routerLink="/tab1/nested">Go to nested page</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Tab1;
