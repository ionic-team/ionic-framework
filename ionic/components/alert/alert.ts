import {Component, ElementRef, Injectable, Renderer} from 'angular2/core';
import {NgClass, NgIf, NgFor, FORM_DIRECTIVES} from 'angular2/common';

import {OverlayController} from '../overlay/overlay-controller';
import {Config} from '../../config/config';
import {Animation} from '../../animations/animation';
import {NavParams} from '../nav/nav-controller';
import {Button} from '../button/button';
import {extend} from '../../util/util';


@Injectable()
export class Alert {

  constructor(private _ctrl: OverlayController, private _config: Config) {

  }

  static create() {
    let alert = new Alert();

    return alert;
  }

}
