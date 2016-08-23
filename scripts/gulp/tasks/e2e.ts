import { SRC_ROOT } from '../constants';
import {dest, src, task} from 'gulp';
import * as path from 'path';

import { execNodeTask } from '../util';

task('build.e2e.ngc', (done: Function) => {
  const fs = require('fs');
  const del = require('del');

  function updateE2eNgc(e2eFolder: string) {
    var e2eNgc = require('../../e2e/NgcConfig.json');

    // If an e2efolder parameter was passed then only transpile that directory
    if (e2eFolder) {
      e2eNgc.include = [
        `src/components/${e2eFolder}/entry.ts`,
        `src/components/${e2eFolder}/AppModule.ts`
      ];
    } else {
      e2eNgc.include = [
        `${SRC_ROOT}/components/*/test/*/entry.ts`,
        `${SRC_ROOT}/components/*/test/*/AppModule.ts`
      ];
    }
    fs.writeFileSync('./scripts/build/generated-ngc-config.json', JSON.stringify(e2eNgc, null, 2));
  }

  const argv = require('yargs').argv;
  let folder = argv.folder;
  updateE2eNgc(folder);
  let startTask = execNodeTask('@angular/compiler-cli', 'ngc', ['-p', './scripts/build/generated-ngc-config.json']);
  startTask( (err: any) => {
    del('./scripts/build/generated-ngc-config.json');
    done(err);
  });
});

task('taco', (done: Function) => {

  setTimeout( () => {
    done();
  }, 20000);

  let list: string[] = [];
  list.push('action-sheet/test/basic')
  list.push('alert/test/basic')
  list.push('alert/test/dismiss')
  list.push('app/test/animations')
  list.push('app/test/cordova')
  list.push('app/test/gesture-collision')
  list.push('app/test/gestures')
  list.push('app/test/storage')
  list.push('app/test/typography')
  list.push('badge/test/basic')
  list.push('button/test/basic')
  list.push('button/test/block')
  list.push('button/test/clear')
  list.push('button/test/dynamic')
  list.push('button/test/fab')
  list.push('button/test/full')
  list.push('button/test/icons')
  list.push('button/test/outline')
  list.push('button/test/raised')
  list.push('button/test/round')
  list.push('button/test/sizes')
  list.push('card/test/advanced')
  list.push('card/test/basic')
  list.push('card/test/images')
  list.push('card/test/list')
  list.push('card/test/map')
  list.push('card/test/social')
  list.push('checkbox/test/basic')
  list.push('chip/test/basic')
  list.push('chip/test/delete')
  list.push('chip/test/icon')
  list.push('chip/test/image')
  list.push('content/test/basic')
  list.push('content/test/fullscreen')
  list.push('datetime/test/basic')
  list.push('datetime/test/labels')
  list.push('grid/test/alignment')
  list.push('grid/test/basic')
  list.push('grid/test/full')
  list.push('icon/test/basic')
  list.push('infinite-scroll/test/basic')
  list.push('infinite-scroll/test/short-list')
  list.push('input/test/clear-input')
  list.push('input/test/fixed-inline-labels')
  list.push('input/test/form-inputs')
  list.push('input/test/floating-labels')
  list.push('input/test/highlight')
  list.push('input/test/inline-labels')
  list.push('input/test/input-focus')
  list.push('input/test/placeholder-labels')
  list.push('input/test/inset-inputs')
  list.push('input/test/stacked-labels')
  list.push('item/test/buttons')
  list.push('item/test/groups')
  list.push('item/test/dividers')
  list.push('item/test/icons')
  list.push('item/test/images')
  list.push('item/test/media')
  list.push('item/test/sliding')
  list.push('item/test/reorder')
  list.push('item/test/text')
  list.push('list/test/header-scenarios')
  list.push('list/test/headers')
  list.push('list/test/inset')
  list.push('list/test/no-lines')
  list.push('list/test/repeat-headers')
  list.push('list/test/sticky')
  list.push('loading/test/tabs')
  list.push('loading/test/basic')
  list.push('menu/test/basic')
  list.push('menu/test/disable-swipe')
  list.push('menu/test/enable-disable')
  list.push('menu/test/multiple')
  list.push('menu/test/overlay')
  list.push('menu/test/push')
  list.push('menu/test/reveal')
  list.push('modal/test/basic')
  list.push('nav/test/basic')
  list.push('nav/test/child-navs')
  list.push('nav/test/init-async')
  list.push('nav/test/insert-views')
  list.push('nav/test/memory')
  list.push('nav/test/nested')
  list.push('picker/test/basic')
  list.push('popover/test/basic')
  list.push('radio/test/basic')
  list.push('range/test/basic')
  list.push('refresher/test/basic')
  list.push('scroll/test/basic')
  list.push('searchbar/test/basic')
  list.push('searchbar/test/nav')
  list.push('searchbar/test/toolbar')
  list.push('select/test/multiple-value')
  list.push('select/test/single-value')
  list.push('segment/test/basic')
  list.push('segment/test/nav')
  list.push('segment/test/swipe')
  list.push('show-hide-when/test/basic')
  list.push('slides/test/basic')
  list.push('slides/test/controller')
  list.push('slides/test/intro')
  list.push('slides/test/loop')
  list.push('slides/test/scroll')
  list.push('spinner/test/basic')
  list.push('tabs/test/advanced')
  list.push('tabs/test/badges')
  list.push('tabs/test/basic')
  list.push('tabs/test/child-navs')
  list.push('tabs/test/colors')
  list.push('tabs/test/tab-bar-scenarios')
  list.push('tabs/test/ghost')
  list.push('toast/test/basic')
  list.push('toggle/test/basic')
  list.push('toolbar/test/colors')
  list.push('toolbar/test/scenarios')
  list.push('virtual-scroll/test/basic')
  list.push('virtual-scroll/test/cards')
  list.push('virtual-scroll/test/image-gallery')
  list.push('virtual-scroll/test/sliding-item')
  list.push('virtual-scroll/test/variable-size');

  let fs = require('fs');
  for ( let string of list ) {
    string = `./src/components/${string}/entry.ts`;
    fs.createReadStream('./scripts/e2e/entry.ts').pipe(fs.createWriteStream(string))
  }




});
