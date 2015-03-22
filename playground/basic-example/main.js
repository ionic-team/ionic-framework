import {bootstrap} from 'angular2/core';
import {Component, Template} from 'angular2/angular2';
import {Aside, AsideParent} from 'ionic2/components/aside/aside';

@Component({
  selector: '[my-app]' 
})
@Template({
  url: 'main.html',
  directives: [Aside, AsideParent]
})
class PlaygroundMain {
  constructor() {
    console.log('Playground Start')
  }
}

bootstrap(PlaygroundMain)
