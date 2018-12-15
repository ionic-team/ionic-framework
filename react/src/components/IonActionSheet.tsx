import React, { SFC } from 'react';
import { ActionSheetOptions, ActionSheetButton } from '@ionic/core';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Props = Omit<ActionSheetOptions, "buttons"> & {
  show: boolean
  children: () => any
}

export class IonActionSheet extends React.Component<Props> {
  element: HTMLIonActionSheetElement;

  constructor(props: Props) {
    super(props);
  }

  async componentDidMount() {
    const actionSheetController = document.querySelector('ion-action-sheet-controller');
    await actionSheetController.componentOnReady();
    let props: ActionSheetOptions = {
      buttons: []
    };
    const {show, children, ...other} = this.props;
    props = { ...props, ...other};

    this.element = await actionSheetController.create(props);
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
