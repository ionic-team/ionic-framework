export class Lifecycle {
  static viewLoaded(component) {
    component.viewLoaded && component.viewLoaded();
  }
  static viewWillShow(component) {
    component.viewWillShow && component.viewWillShow();
  }
  static viewEntered(component) {
    component.viewEntered && component.viewEntered();
  }
  static viewDestroyed(component) {
    component.viewDestroyed && component.viewDestroyed();
  }
}
