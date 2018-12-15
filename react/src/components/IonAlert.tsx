import React, { SFC } from 'react';
import { AlertInput, AlertButton, AlertOptions } from '@ionic/core';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Props = Omit<AlertOptions, "inputs" | "buttons"> & {
  show: boolean
  children: () => any
}

export class IonAlert extends React.Component<Props> {
  element: HTMLIonAlertElement;

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();
    const {show, children, ...props} = this.props;

    this.element = await alertController.create(props);
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
