import { setupConfig } from '@ionic/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

setupConfig({
  platform: {
    'cordova': (win: any) => {
      const isCordova = !!(win['cordova'] || win['phonegap'] || win['PhoneGap']);
      console.log('Checking if platform is "cordova" with a custom detection method: ', isCordova);
      return isCordova;
    },
  }
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
