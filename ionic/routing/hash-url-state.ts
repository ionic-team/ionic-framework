import {IonicRouter} from './router';
import * as util from '../util/util';


class HashUrlStateManager {

  constructor(router, ionicApp, ionicConfig, window) {
    this.router = router;
    this.ionicApp = ionicApp;
    this.ionicConfig = ionicConfig;
    this.location = window.location;
    this.history = window.history;

    window.addEventListener('popstate', ev => {
      this.onPopState(ev);
    });
  }

  stateChange(path, type, activeView) {
    if (type == 'pop') {
      // if the popstate came from the browser's back button (and not Ionic)
      // then we shouldn't force another browser history.back()
      // only do a history.back() if the URL hasn't been updated yet
      if (this.isDifferentPath(path)) {
        this.history.back();
      }

    } else {
      // push state change
      let enteringState = {
        path: path,
        backPath: this.router.lastPath(),
        forwardPath: null
      };

      if (this._hasInit) {
        // update the leaving state to know what it's forward state will be
        let leavingState = util.extend(this.history.state, {
          forwardPath: enteringState.path
        });
        if (leavingState.path !== enteringState.path) {
          this.history.replaceState(leavingState, '', '#' + leavingState.path);
        }

        if (this.isDifferentPath(path)) {
          // push the new state to the history stack since the path
          // isn't already in the location hash
          this.history.pushState(enteringState, '', '#' + enteringState.path);
        }

      } else {
        // replace the very first load with the correct entering state info
        this.history.replaceState(enteringState, '', '#' + enteringState.path);
        this._hasInit = true;
      }
    }
  }

  onPopState(ev) {
    let newState = ev.state || {};
    let newStatePath = newState.path;
    let newStateBackPath = newState.backPath;
    let newStateForwardPath = newState.forwardPath;
    let lastLoadedStatePath = this.router.lastPath();

    if (newStatePath === lastLoadedStatePath) {
      // do nothing if the last path is the same
      // as the "new" current state
      return;
    }

    let activeViewCtrl = this.router.activeViewController();
    if (activeViewCtrl) {

      if (newStateForwardPath === lastLoadedStatePath) {
        // if the last loaded state path is the same as the new
        // state's forward path then the user is moving back
        activeViewCtrl.pop();

      } else if (newStateBackPath === lastLoadedStatePath) {
        // if the last loaded state path is the new state's
        // back path, then the user is moving forward
        this.loadByPath(newStatePath);
      }

    }
  }

  getCurrentPath() {
    // Grab the path without the leading hash
    return {
      path: this.location.hash.slice(1),
      priority: 0
    }
  }

  isDifferentPath(path) {
    // check if the given path is different than the current location
    return (this.location.hash !== ('#' + path));
  }

}


IonicRouter.registerStateManager('hashurl', HashUrlStateManager);
