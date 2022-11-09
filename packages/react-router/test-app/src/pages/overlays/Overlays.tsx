import { IonButton, IonContent, IonModal } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router';

const Overlays: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const history = useHistory();

  const goBack = () => history.goBack();
  const replace = () => history.replace('/');
  const push = () => history.push('/');

  return (
    <>
      <IonButton id="openModal" onClick={() => setIsOpen(true)}>
        Open Modal
      </IonButton>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={() => {
          setIsOpen(false);
        }}
      >
        <IonContent>
          <IonButton id="goBack" onClick={goBack}>
            Go Back
          </IonButton>
          <IonButton id="replace" onClick={replace}>
            Replace
          </IonButton>
          <IonButton id="push" onClick={push}>
            Push
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default Overlays;
