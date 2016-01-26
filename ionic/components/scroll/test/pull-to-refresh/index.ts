import {App} from 'ionic/ionic';


@App({
  templateUrl: 'main.html'
})
class E2EApp {

  doRefresh(refresher) {
    console.log('DOREFRESH', refresher)

    setTimeout(() => {
      refresher.complete();
      console.log("Complete");
    }, 5000);
  }

  doStarting() {
    console.log('DOSTARTING');
  }

  doPulling(amt) {
    console.log('DOPULLING', amt);
  }
}
