import React from 'react';
import { ModalOptions } from '@ionic/core';

type Props = ModalOptions & {
  show: boolean
}

export class IonModal extends React.Component<Props> {
  element: HTMLIonModalElement;

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const modalController = document.querySelector('ion-modal-controller');
    await modalController.componentOnReady();
    const {show, ...props} = this.props;

    this.element = await modalController.create(props);
  }

  async componentDidUpdate(prevProps: Props) {
    if (!prevProps.show && this.props.show) {
      return await this.element.present();
    }
    if (prevProps.show && !this.props.show) {
      return await this.element.dismiss();
    }
  }
}
