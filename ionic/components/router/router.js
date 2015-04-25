import {Component, View as NgView, Inject, Parent, NgElement} from 'angular2/angular2'
import {Log} from 'ionic/util'

/**
 * A simple routing system that detects a URL and calls
 * a handler.
 */
export class Router {
  static open(url) {
    Log.log('Router: open from url', url)
  }
}

