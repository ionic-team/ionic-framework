import {App} from 'ionic/ionic';

import {FirstPage} from './pages/first-page';
import {SecondPage} from './pages/second-page';
import {ThirdPage} from './pages/third-page';


@App({
  routes: [
    {
      path: '/firstpage',
      component: FirstPage,
      root: true
    },
    {
      path: '/secondpage',
      component: SecondPage,
    },
    {
      path: '/thirdpage',
      component: ThirdPage,
    }
  ]
})
class MyApp {}
