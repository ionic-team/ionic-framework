import React from 'react';
import { PopoverOptions } from '@ionic/core';

type Props = PopoverOptions & {
  show: boolean
}

export class IonPopover extends React.Component<Props> {
  element: HTMLIonPopoverElement;

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const popoverController = document.querySelector('ion-popover-controller');
    await popoverController.componentOnReady();
    const {show, ...props} = this.props;

    this.element = await popoverController.create(props);
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
