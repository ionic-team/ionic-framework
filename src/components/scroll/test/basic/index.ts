import {App} from '../../../../../src';


@App({
  templateUrl: 'main.html'
})
class MyApp {
  doRefresh() {
    console.log('DOREFRESH')
  }
}
