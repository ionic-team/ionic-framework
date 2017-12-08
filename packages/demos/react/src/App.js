import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import PageOne from './pages/PageOne';

import { Delegate, wc } from '@ionic/react';

class App extends Component {
  render() {
    return (
      <ion-app>
        <ion-nav ref={wc({},{
          root: PageOne,
          delegate: Delegate
        })}></ion-nav>
      </ion-app>
    );
  }
}

export default App;
