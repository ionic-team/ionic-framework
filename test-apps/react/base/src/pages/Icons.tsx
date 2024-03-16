import React, { useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/react';
import { heart, heartCircleOutline, logoApple, logoTwitter, personCircleOutline, star, starOutline, trash } from 'ionicons/icons';

interface IconsProps {}

const Icons: React.FC<IconsProps> = () => {
  const [dynamic, setDynamic] = useState(star);
  const iosCustomSvg = "../assets/logo-apple.svg";
  const mdCustomSvg = "../assets/logo-android.svg";

  const toggle = () => {
    setDynamic(dynamic => dynamic === star ? starOutline : star);
  }

  return (
    <>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons>
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Icons</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Icons</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          <IonItem>
            <IonIcon slot="start" icon={heart}></IonIcon>
            <IonLabel>Static Icons</IonLabel>
            <IonIcon slot="end" icon={personCircleOutline} color="dark"></IonIcon>
            <IonIcon slot="end" icon={trash} color="danger"></IonIcon>
          </IonItem>
          <IonItem>
            <IonIcon icon={logoApple} slot="start"></IonIcon>
            <IonLabel>Logo Icons</IonLabel>
            <IonIcon icon={logoTwitter} slot="end"></IonIcon>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" icon={dynamic} color="warning"></IonIcon>
            <IonLabel>Dynamic Icon</IonLabel>
            <IonButton slot="end" fill="outline" onClick={() => toggle()}>
              Toggle Icon
            </IonButton>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" ios={heartCircleOutline} md={personCircleOutline}></IonIcon>
            <IonLabel>
              <p>ios: heart circle</p>
              <p>md: person circle</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" ios={starOutline} md={star}></IonIcon>
            <IonLabel>
              <p>ios: star outline</p>
              <p>md: star</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" mode="ios" ios={starOutline} md={star}></IonIcon>
            <IonLabel>
              <h3>mode: ios</h3>
              <p>ios: star outline</p>
              <p>md: star</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" mode="md" ios={starOutline} md={star}></IonIcon>
            <IonLabel>
              <h3>mode: md</h3>
              <p>ios: star outline</p>
              <p>md: star</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon id="customSvg" slot="start" ios={iosCustomSvg} md={mdCustomSvg}></IonIcon>
            <IonLabel>
              <p>Custom SVG</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </>
  );
};

export default Icons;
