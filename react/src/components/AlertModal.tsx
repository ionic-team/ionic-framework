import React from 'react';
import { Components } from '@ionic/core';


const IonAlertModal: React.SFC<Components.IonAlertAttributes> = () => {
  return null;
}

export default IonAlertModal;

/*
import IonAlertModal, { Header, SubHeader, Message, Button} from 'IonAlertModal';

<IonAlertModal isOpen={state.showModal}>
  <Header>Favorite Added</Header>
  <SubHeader></SubHeader>
  <Message>Favorite info</Message>
  <Button onClick={(e: MouseEvent) => { this.setState({ showModal: false})}}>OK</Button>
</IonAlertModal>
*/
