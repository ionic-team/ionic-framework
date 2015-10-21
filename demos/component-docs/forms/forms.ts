import {FORM_DIRECTIVES, FormBuilder, forwardRef, Validators, Control, ControlGroup} from 'angular2/angular2';
import {Page} from 'ionic/ionic';
import {AndroidAttribute} from '../helpers';



@Page({
  templateUrl: 'forms/forms.html',
  providers: [FormBuilder],
  directives: [forwardRef(() => AndroidAttribute)]
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
  directives: [forwardRef(() => AndroidAttribute)]
})
export class FixedInlinePage {
    constructor() {

    }
}

@Page({
  templateUrl: 'forms/floating.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class FloatingPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/inline.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class InlinePage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/inset.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class InsetPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/placeholder.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class PlaceholderPage {
    constructor() {

    }
}


@Page({
  templateUrl: 'forms/stacked.html',
  directives: [forwardRef(() => AndroidAttribute)]
})
export class StackedPage {
    constructor() {

    }
}
