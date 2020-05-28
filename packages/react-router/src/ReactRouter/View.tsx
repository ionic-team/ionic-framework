import { IonLifeCycleContext, NavContext } from '@ionic/react';
import React from 'react';
import { Redirect } from 'react-router';

import { isDevMode } from '../utils';

import { ViewItem } from './ViewItem';

interface ViewProps extends React.HTMLAttributes<HTMLElement> {
  onViewSync: (page: HTMLElement, viewId: string) => void;
  onHideView: (viewId: string) => void;
  view: ViewItem;
  route: any;
}

/**
 * The View component helps manage the IonPage's lifecycle and registration
 */
export class View extends React.Component<ViewProps, {}> {
  context!: React.ContextType<typeof IonLifeCycleContext>;
  ionPage?: HTMLElement;

  componentDidMount() {
    /**
     * If we can tell if view is a redirect, hide it so it will work again in future
     */
    const { view, route } = this.props;
    if (route.type === Redirect) {
      this.props.onHideView(view.id);
    } else if (route.props.render && !view.isIonRoute) {
      // Test the render to see if it returns a redirect
      if (route.props.render().type === Redirect) {
        this.props.onHideView(view.id);
      }
    }
  }

  componentWillUnmount() {
    if (this.ionPage) {
      this.ionPage.removeEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
      this.ionPage.removeEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
      this.ionPage.removeEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
      this.ionPage.removeEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    }
  }

  ionViewWillEnterHandler() {
    this.context.ionViewWillEnter();
  }

  ionViewDidEnterHandler() {
    this.context.ionViewDidEnter();
  }

  ionViewWillLeaveHandler() {
    this.context.ionViewWillLeave();
  }

  ionViewDidLeaveHandler() {
    this.context.ionViewDidLeave();
  }

  registerIonPage(page: HTMLElement) {
    this.ionPage = page;
    this.ionPage.addEventListener('ionViewWillEnter', this.ionViewWillEnterHandler.bind(this));
    this.ionPage.addEventListener('ionViewDidEnter', this.ionViewDidEnterHandler.bind(this));
    this.ionPage.addEventListener('ionViewWillLeave', this.ionViewWillLeaveHandler.bind(this));
    this.ionPage.addEventListener('ionViewDidLeave', this.ionViewDidLeaveHandler.bind(this));
    this.ionPage.classList.add('ion-page-invisible');
    if (isDevMode()) {
      this.ionPage.setAttribute('data-view-id', this.props.view.id);
    }
    this.props.onViewSync(page, this.props.view.id);
  }

  render() {
    return (
      <NavContext.Consumer>
        {value => {
          const newProvider = {
            ...value,
            registerIonPage: this.registerIonPage.bind(this)
          };

          return (
            <NavContext.Provider value={newProvider}>
              {this.props.children}
            </NavContext.Provider>
          );

        }}
      </NavContext.Consumer>
    );
  }

  static get contextType() {
    return IonLifeCycleContext;
  }
}
