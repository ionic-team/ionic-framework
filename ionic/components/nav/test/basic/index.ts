import {App} from 'ionic/ionic';


@App({
  routes: {
    'FirstPage': {
      'path': '/firstpage',
      'module': 'dist/examples/nav/basic/pages/first-page',
      'root': true
    },
    'SecondPage': {
      'path': '/secondpage',
      'module': 'dist/examples/nav/basic/pages/second-page',
    },
    'ThirdPage': {
      'path': '/thirdpage',
      'module': 'dist/examples/nav/basic/pages/third-page',
    },
  }
})
class MyApp {}
