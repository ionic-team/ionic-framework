
let registry = {};

class TransitionController {

  create(navCtrl, opts = {}) {
    let name = opts.animation || 'ios';

    let TransitionClass = registry[name];
    if (!TransitionClass) {
      TransitionClass = registry['none'];
    }

    return new TransitionClass(navCtrl, opts);
  }

  register(name, transitionClass) {
    registry[name] = transitionClass;
  }

}

export let Transition = new TransitionController();
