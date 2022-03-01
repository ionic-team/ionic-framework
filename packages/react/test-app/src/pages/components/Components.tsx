import React from 'react';
import { IonRouterOutlet } from '@ionic/react';
import { Route, Redirect } from 'react-router';
import InputComponent from './InputComponent';
import TextareaComponent from './TextareaComponent';
import SearchbarComponent from './SearchbarComponent';

interface ComponentsProps {}

const Components: React.FC<ComponentsProps> = () => {
  return (
    <IonRouterOutlet>
      <Redirect from="/components" to="/components/input" exact />
      <Route path="/components/input" component={InputComponent} />
      <Route path="/components/textarea" component={TextareaComponent} />
      <Route path="/components/searchbar" component={SearchbarComponent} />
    </IonRouterOutlet>
  );
};

export default Components;
