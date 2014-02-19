
angular.element.prototype.addClass = function(cssClasses) {
  if (cssClasses && cssClasses != 'ng-scope' && cssClasses != 'ng-isolate-scope') {
    for(var x=0; x<this.length; x++) {
      if(this[x].setAttribute) {
        this[x].classList.add.apply(this[x].classList, cssClasses.split(/\s+/));
      }
    }
  }
  return this;
};

angular.element.prototype.removeClass = function(cssClasses) {
  if (cssClasses) {
    for(var x=0; x<this.length; x++) {
      if(this[x].setAttribute) {
        this[x].classList.remove.apply(this[x].classList, cssClasses.split(/\s+/));
      }
    }
  }
  return this;
};
