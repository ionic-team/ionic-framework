import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class MyApp {

  doRefresh(refresher) {
    console.log('DOREFRESH', refresher)

    setTimeout(() => {
      refresher.complete();
    })
  }

  doStarting() {
    console.log('DOSTARTING');
  }

  doPulling(amt) {
    console.log('DOPULLING', amt);
  }
}
