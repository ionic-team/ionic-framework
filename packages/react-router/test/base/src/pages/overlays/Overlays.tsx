import { IonButton, IonContent, IonModal } from '@ionic/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Overlays: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const replace = () => navigate('/', { replace: true });
  const push = () => navigate('/');

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
