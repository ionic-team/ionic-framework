export class Lifecycle {
  static viewLoaded(component) {
    component.viewLoaded && component.viewLoaded();
  }
  static viewWillShow(component) {
    component.viewWillShow && component.viewWillShow();
  }
}
