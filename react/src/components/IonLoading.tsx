import React from 'react';
import { LoadingOptions } from '@ionic/core';

type Props = LoadingOptions & {
  show: boolean
}

export class IonLoading extends React.Component<Props> {
  element: HTMLIonLoadingElement;

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const loadingController = document.querySelector('ion-loading-controller');
    await loadingController.componentOnReady();
    const {show, ...props} = this.props;

    this.element = await loadingController.create(props);
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
