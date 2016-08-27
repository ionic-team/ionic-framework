import { IonicApp } from '../components/app/app-root';


export class FeatureDetect {
  private _r: {[featureName: string]: boolean} = {};

  test(appRoot: IonicApp) {
    for (let name in featureDetects) {
      this._r[name] = !!featureDetects[name].test();
      if (this._r[name]) {
        appRoot.setElementClass(name, true);
      }
    }
    featureDetects = null;
  }

  has(featureName: string): boolean {
    return !!this._r[featureName];
  }

  static add(name: string, test: any) {
    // feature detection tests should only run on client side
    if ((<any>this).window) {
      featureDetects[name] = new test();
    }
  }

}

let featureDetects: {[featureName: string]: FeatureDetectTest} = {};


export abstract class FeatureDetectTest {
  abstract test(): boolean;
}


/**
* backdrop-filter Test
* Checks if css backdrop-filter is implemented by the browser.
*/
export class BackdropFilterTest implements FeatureDetectTest {

  test() {
    const styles = <any>document.documentElement.style;
    return !!(styles['backdrop-filter'] !== undefined || styles['-webkit-backdrop-filter'] !== undefined);
  }

}

FeatureDetect.add('backdrop-filter', BackdropFilterTest);
