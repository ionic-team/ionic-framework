import {App, Page, Picker, NavController} from 'ionic-angular';


@Page({
  templateUrl: 'main.html'
})
class E2EPage {

  constructor(private nav: NavController) {
    setTimeout(() => {
      this.presentPicker()
    }, 250);
  }

  presentPicker() {
    let picker = Picker.create({
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        'Done'
      ],
      columns: [
        {
          prefix: 'prefix',
          suffix: 'suffix',
          options: [
            { text: 'Jan' },
            { text: 'Feb' },
            { text: 'Mar' },
            { text: 'Apr' },
            { text: 'May' },
            { text: 'Jun' },
            { text: 'Jul' },
            { text: 'Aug' },
            { text: 'Sep' },
            { text: 'Oct' },
            { text: 'Nov' },
            { text: 'Dec' },
          ]
        },
        // {
        //   prefix: 'prefix',
        //   suffix: 'suffix',
        //   options: [
        //     { text: 'Jan' },
        //     { text: 'Feb' },
        //     { text: 'Mar' },
        //     { text: 'Apr' },
        //     { text: 'May' },
        //     { text: 'Jun' },
        //     { text: 'Jul' },
        //     { text: 'Aug' },
        //     { text: 'Sep' },
        //     { text: 'Oct' },
        //     { text: 'Nov' },
        //     { text: 'Dec' },
        //   ]
        // },
      ]
    });

    this.nav.present(picker);
  }
}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}
