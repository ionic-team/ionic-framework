(function() {

function trueFn() { return true; }

ionic.Utils.list = list;

function list(initialArray) {

  var array =  angular.isArray(initialArray) ? initialArray : [];
  var self = {};
  var isLooping = false;

  // The Basics
  self.add = add;
  self.remove = remove;
  self.at = at;
  self.count = count;
  self.indexOf = angular.bind(array, array.indexOf);
  self.isInRange = isInRange;
  self.loop = loop;

  // The Crazy Ones
  self.delta = delta;
  self.isRelevant = isRelevant;
  self.left = left;
  self.right = right;

  return self;

  //
  // Public methods
  //
  function add(item, index) {
    if (!self.isInRange(index)) index = array.length;
    array.splice(index, 0, item);
    return index;
  }

  function remove(index) {
    if (!self.isInRange(index)) return;
    array.splice(index, 1);
  }

  function at(index) {
    return array[index];
  }

  function count() {
    return array.length;
  }

  function isInRange(index) {
    return index > -1 && index < array.length;
  }

  function loop(newIsLooping) {
    if (arguments.length) {
      isLooping = !!newIsLooping;
    }
    return isLooping;
  }

  function delta(fromIndex, toIndex) {
    var difference = toIndex - fromIndex;
    if (!isLooping) return difference;

    // Is looping on? Then check for the looped difference.
    // For example, going from the first item to the last item
    // is actually a change of -1.
    var loopedDifference = 0;
    if (toIndex > fromIndex) {
      loopedDifference = toIndex - fromIndex - self.count();
    } else {
      loopedDifference = self.count() - fromIndex + toIndex;
    }

    if (Math.abs(loopedDifference) < Math.abs(difference)) {
      return loopedDifference;
    }
    return difference;
  }

  // Returns whether an index is 'relevant' to some index.
  // Will return true if the index is equal to `someIndex`, the index
  // left of that index, or the index right of that index.
  function isRelevant(index, someIndex) {
    return self.isInRange(index) && (
      index === someIndex ||
      index === self.left(someIndex) ||
      index === self.right(someIndex)
    );
  }

  // Get the index to the right of the given index.
  // Takes looping and the given filterFn into account.
  function right(index, filterFn) {
    filterFn = filterFn || trueFn;
    if (!self.isInRange(index)) return -1;

    // Keep adding 1 to index, trying to find an index that passes filterFn.
    // If we loop through *everything* and get back to our original index, return -1.
    // We don't use recursion here because Javascript sucks at recursion.
    var nextIndex = index;
    while ( (++nextIndex) !== index ) {

      if (nextIndex === array.length) {
        if (isLooping) {
          nextIndex -= array.length;
        } else {
          break;
        }
      }

      if (filterFn(array[nextIndex], nextIndex)) {
        return nextIndex;
      }
    }
    return -1;
  }

  // Get the index to the left of the given index.
  // Takes looping and the given filterFn into account.
  function left(index, filterFn) {
    filterFn = filterFn || trueFn;
    if (!self.isInRange(index)) return -1;

    // Keep subtracting 1 from index, trying to find an index that passes filterFn.
    // If we loop through *everything* and get back to our original index, return -1.
    // We don't use recursion here because Javascript sucks at recursion.
    var prevIndex = index;
    while ( (--prevIndex) !== index ) {

      if (prevIndex === -1) {
        if (isLooping) {
          prevIndex += array.length;
        } else {
          break;
        }
      }

      if (filterFn(array[prevIndex], prevIndex)) {
        return prevIndex;
      }
    }
    return -1;
  }

}

})();
