// import * as util from '../util/util';
// import {IonicConfig} from '../config/config';


// let platformRegistry = {};

// export class Platform extends IonicConfig {

//   constructor(settings={}) {
//     super(settings);
//     this._chld = {};
//     this._parent = null;
//   }

//   parent(val) {
//     if (arguments.length) {
//       this._parent = val;
//     }
//     return this._parent;
//   }

//   app(val) {
//     if (arguments.length) {
//       this._app = val;
//     }
//     return this._app;
//   }

//   name(val) {
//     if (arguments.length) {
//       this._name = val;
//     }
//     return this._name;
//   }

//   is(platformName, climbToRoot) {
//     if (this._name == platformName) {
//       return true;
//     }

//     let platform = null;

//     if (climbToRoot !== false) {
//       platform = this._parent
//       while (platform) {
//         if (platform.name() == platformName) {
//           return true;
//         }
//         platform = platform._parent;
//       }
//     }

//     for (let childPlatform in this._chld) {
//       platform = this._chld[childPlatform];
//       platform.app(this._app);
//       if (platform.is(platformName, false) == platform.isMatch()) {
//         return true;
//       }
//     }

//     return false;
//   }

//   matchesQuery(queryKey, queryValue) {
//     const qs = this._app.query()[queryKey];
//     return !!(qs && qs == queryValue);
//   }

//   matchesUserAgent(userAgentExpression) {
//     const rx = new RegExp(userAgentExpression, 'i');
//     return rx.test( this._app.userAgent() );
//   }

//   matchesPlatform(platformQueryValue, platformUserAgentExpression) {
//     return this.matchesQuery('ionicplatform', platformQueryValue) ||
//            this.matchesUserAgent(platformUserAgentExpression);
//   }

//   matchesDevice(deviceQueryValue, deviceUserAgentExpression) {
//     return this.matchesQuery('ionicdevice', deviceQueryValue) ||
//            this.matchesUserAgent(deviceUserAgentExpression);
//   }

//   registerChild(platformName, PlatformClass) {
//     let platform = new PlatformClass();
//     platform.name(platformName);
//     platform.parent(this);
//     this._chld[platformName] = platform;
//   }

//   root() {
//     let rootPlatform = this;
//     while (rootPlatform._parent) {
//       rootPlatform = rootPlatform._parent;
//     }
//     return rootPlatform;
//   }

//   runAll() {
//     let platform = null;

//     if (this.isMatch()) {
//       this.run();

//       for (let childPlatform in this._chld) {
//         this._chld[childPlatform].app(this._app);
//         this._chld[childPlatform].runAll();
//       }
//     }
//   }

//   getActive() {
//     let platform = null;

//     if (this.isMatch()) {
//       for (let childPlatform in this._chld) {
//         this._chld[childPlatform].app(this._app);
//         platform = this._chld[childPlatform].getActive();
//         if (platform) {
//           return platform;
//         }
//       }

//       return this;
//     }

//     return null;
//   }


//   /* Methods to Override */
//   isMatch() { return true; }
//   run() {}


//   /* Static Methods */
//   static register(platformName, PlatformClass) {
//     basePlatform.registerChild(platformName, PlatformClass);
//   }

//   static getActivePlatform(app) {
//     basePlatform.app(app);
//     return basePlatform.getActive(app);
//   }

//   static setBase(PlatformClass) {
//     basePlatform = new PlatformClass();
//   }

// }

// let basePlatform = null;


console.log('')
