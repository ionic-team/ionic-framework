

export class Transition {

  static create(navCtrl, opts = {}) {
    const name = opts.animation || 'ios';

    let TransitionClass = transitionRegistry[name];
    if (!TransitionClass) {
      TransitionClass = transitionRegistry.ios;
    }

    return new TransitionClass(navCtrl, opts);
  }

  static register(name, TransitionClass) {
    transitionRegistry[name] = TransitionClass;
  }

}

let transitionRegistry = {};
