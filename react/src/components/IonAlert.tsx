import React from 'react';
import { AlertOptions } from '@ionic/core';

type Props = AlertOptions & {
  show: boolean
}

export default class IonAlert extends React.Component<Props> {
  element: HTMLIonAlertElement;
  alertControllerElement: HTMLIonAlertControllerElement;

  constructor(props: Props) {
    super(props);
  }

  static get displayName() {
    return 'IonAlert';
  }

  async componentDidMount() {
    this.alertControllerElement = ensureElementInBody('ion-alert-controller');
    await this.alertControllerElement.componentOnReady();
  }

  async componentDidUpdate(prevProps: Props) {
    if (prevProps.show !== this.props.show && this.props.show === true) {
      this.element = await this.alertControllerElement.create(this.props);
      return await this.element.present();
    }
    if (prevProps.show !== this.props.show && this.props.show === false) {
      return await this.element.dismiss();
    }
  }

  render(): null {
    return null;
  }
}

export function ensureElementInBody(elementName: string) {
  let element = document.querySelector(elementName);
  if (!element) {
    element = document.createElement(elementName);
    document.body.appendChild(element);
  }
  return element as HTMLIonAlertControllerElement;
}
