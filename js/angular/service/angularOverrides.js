
jqLite.prototype.addClass = function(cssClasses) {
  var x, y, cssClass, el, splitClasses, existingClasses;
  if (cssClasses && cssClasses != 'ng-scope' && cssClasses != 'ng-isolate-scope') {
    for (x = 0; x < this.length; x++) {
      el = this[x];
      if (el.setAttribute) {

        if (cssClasses.indexOf(' ') < 0 && el.classList.add) {
          el.classList.add(cssClasses);
        } else {
          existingClasses = (' ' + (el.getAttribute('class') || '') + ' ')
            .replace(/[\n\t]/g, " ");
          splitClasses = cssClasses.split(' ');

          for (y = 0; y < splitClasses.length; y++) {
            cssClass = splitClasses[y].trim();
            if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
              existingClasses += cssClass + ' ';
            }
          }
          el.setAttribute('class', existingClasses.trim());
        }
      }
    }
  }
  return this;
};

jqLite.prototype.removeClass = function(cssClasses) {
  var x, y, splitClasses, cssClass, el;
  if (cssClasses) {
    for (x = 0; x < this.length; x++) {
      el = this[x];
      if (el.getAttribute) {
        if (cssClasses.indexOf(' ') < 0 && el.classList.remove) {
          el.classList.remove(cssClasses);
        } else {
          splitClasses = cssClasses.split(' ');

          for (y = 0; y < splitClasses.length; y++) {
            cssClass = splitClasses[y];
            el.setAttribute('class', (
                (" " + (el.getAttribute('class') || '') + " ")
                .replace(/[\n\t]/g, " ")
                .replace(" " + cssClass.trim() + " ", " ")).trim()
            );
          }
        }
      }
    }
  }
  return this;
};
