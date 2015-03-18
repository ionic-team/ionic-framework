import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Tabbar} from 'ionic/components/tabbar/tabbar';

@Component({ selector: 'playground-main' })
@Template({ 
  url: 'app.html',
  directives: [Tabbar]
})
class PlaygroundMain {}

bootstrap(PlaygroundMain);
