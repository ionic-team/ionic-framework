import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from 'angular2/angular2';
import {Page} from 'ionic/ionic';


@Page({
  templateUrl: 'forms/forms.html',
  bindings: [FormBuilder]
})
export class FormsPage {

  constructor() {
    this.form = new ControlGroup({
      firstName: new Control("", Validators.required),
      lastName: new Control("", Validators.required)
    });
  }

  processForm(event) {
    // TODO: display input in a popup
    console.log(event);
  }

    
}

@Page({
  templateUrl: 'forms/fixed-inline.html',
})
export class FixedInlinePage {
    constructor() {

    }
}

@Page({
  templateUrl: 'forms/floating.html',
})
export class FloatingPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/inline.html',
})
export class InlinePage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/inset.html',
})
export class InsetPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/placeholder.html',
})
export class PlaceholderPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/stacked.html',
})
export class StackedPage {
    constructor() {

    }
}
