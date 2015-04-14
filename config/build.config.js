var pkg = require('../package.json');
var fs = require('fs');

var DISCOURSE_FILE = __dirname + '/DISCOURSE_POST_URL';

module.exports = {
  dist: 'dist',
  releasePostUrl: fs.readFileSync(DISCOURSE_FILE).toString(),
  releasePostFile: DISCOURSE_FILE,

  protractorPort: 8876,

  banner:
    '/*!\n' +
    ' * Copyright 2014 Drifty Co.\n' +
    ' * http://drifty.com/\n' +
    ' *\n' +
    ' * Ionic, v<%= pkg.version %>\n' +
    ' * A powerful HTML5 mobile app framework.\n' +
    ' * http://ionicframework.com/\n' +
    ' *\n' +
    ' * By @maxlynch, @benjsperry, @adamdbradley <3\n' +
    ' *\n' +
    ' * Licensed under the MIT license. Please see LICENSE for more information.\n'+
    ' *\n' +
    ' */\n\n',
  bundleBanner:
    '/*!\n' +
    ' * ionic.bundle.js is a concatenation of:\n' +
    ' * ionic.js, angular.js, angular-animate.js,\n'+
    ' * angular-sanitize.js, angular-ui-router.js,\n'+
    ' * and ionic-angular.js\n'+
    ' */\n\n',
  closureStart: '(function() {\n',
  closureEnd: '\n})();',

  ionicFiles: [
    // Base
    'js/ionic.js',

    // Utils
    'js/utils/delegateService.js',
    'js/utils/dom.js',
    'js/utils/events.js',
    'js/utils/gestures.js',
    'js/utils/platform.js',
    'js/utils/poly.js',
    'js/utils/tap.js',
    'js/utils/activator.js',
    'js/utils/utils.js',
    'js/utils/list.js',
    'js/utils/keyboard.js',
    'js/utils/viewport.js',

    // Views
    'js/views/view.js',
    'js/views/scrollView.js',
    'js/views/scrollViewNative.js',
    'js/views/listView.js',
    'js/views/modalView.js',
    'js/views/sideMenuView.js',
    'js/views/sliderView.js',
    'js/views/toggleView.js'
  ],

  angularIonicFiles: [
    'js/angular/*.js',
    'js/angular/service/**/*.js',
    'js/angular/controller/**/*.js',
    'js/angular/directive/**/*.js'
  ],

  //Which vendor files to include in dist, used by build
  //Matched relative to config/lib/
  vendorFiles: [
    'js/angular/angular-animate.js',
    'js/angular/angular-animate.min.js',
    'js/angular/angular-resource.js',
    'js/angular/angular-resource.min.js',
    'js/angular/angular-sanitize.js',
    'js/angular/angular-sanitize.min.js',
    'js/angular/angular.js',
    'js/angular/angular.min.js',
    'js/angular-ui/angular-ui-router.js',
    'js/angular-ui/angular-ui-router.min.js',
    'fonts/ionicons.eot',
    'fonts/ionicons.svg',
    'fonts/ionicons.ttf',
    'fonts/ionicons.woff'
  ],

  ionicBundleFiles: [
    'js/ionic.js',
    'js/angular/angular.js',
    'js/angular/angular-animate.js',
    'js/angular/angular-sanitize.js',
    'js/angular-ui/angular-ui-router.js',
    'js/ionic-angular.js'
  ],

  //Exclamation can be no longer than 14 chars
  exclamations: [
    "Aah","Ah","Aha","All right","Aw","Ay","Aye","Bah","Boy","By golly","Boom","Cheerio","Cheers","Come on","Crikey","Dear me","Egads","Fiddle-dee-dee","Gadzooks","Gangway","G'day","Gee whiz","Gesundheit","Get outta here","Gosh","Gracious","Great","Gulp","Ha","Ha-ha","Hah","Harrumph","Hey","Hooray","Hurray","Huzzah","I say","Look","Look here","Long time","Lordy","Most certainly","My my","My word","Oh","Oh-oh","Oh no","Okay","Okey-dokey","Ooh","Oye","Phew","Quite","Ready","Right on","Roger that","Rumble","Say","See ya","Snap","Sup","Ta-da","Take that","Tally ho","Thanks","Toodles","Touche","Tut-tut","Very nice","Very well","Voila","Vroom","Well done","Well, well","Whoa","Whoopee","Whew","Word up","Wow","Wuzzup","Ya","Yea","Yeah","Yippee","Yo","Yoo-hoo","You bet","You don't say","You know","Yow","Yum","Yummy","Zap","Zounds","Zowie"
  ],

  //Message can be no longer than it is. Currently it's 126 chars with the short git urls,
  //and can have up to a 14 char long exclamation prepended.
  releaseMessage: function() {
    return this.exclamations[Math.floor(Math.random()*this.exclamations.length)] + '! ' +
      'Just released @IonicFramework v' + pkg.version + ' "' + pkg.codename + '"! ' +
      this.releasePostUrl;
  },

};
