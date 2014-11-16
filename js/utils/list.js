(function() {

function trueFn() { return true; }

ionic.Utils.list = wrapList;

// Expose previous and next publicly so we can use them
// without having to instantiate a whole list wrapper.
ionic.Utils.list.next = listNext;
ionic.Utils.list.previous = listPrevious;

// Get the index after the given index.
// Takes looping and the given filterFn into account.
function listNext(list, isLooping, index, filterFn) {
  filterFn = filterFn || trueFn;
  if (index < 0 || index >= list.length) return -1;

  // Keep adding 1 to index, trying to find an index that passes filterFn.
  // If we loop through *everything* and get back to our original index, return -1.
  // We don't use recursion here because Javascript sucks at recursion.
  var nextIndex = index + 1;
  while ( nextIndex !== index ) {

    if (nextIndex === list.length) {
      if (isLooping) nextIndex -= list.length;
      else break;
    } else {
      if (filterFn(list[nextIndex], nextIndex)) {
        return nextIndex;
      }
      nextIndex++;
    }
  }
  return -1;
}

// Get the index before the given index.
// Takes looping and the given filterFn into account.
function listPrevious(list, isLooping, index, filterFn) {
  filterFn = filterFn || trueFn;
  if (index < 0 || index >= list.length) return -1;

  // Keep subtracting 1 from index, trying to find an index that passes filterFn.
  // If we loop through *everything* and get back to our original index, return -1.
  // We don't use recursion here because Javascript sucks at recursion.
  var prevIndex = index - 1;
  while ( prevIndex !== index ) {

    if (prevIndex === -1) {
      if (isLooping) prevIndex += list.length;
      else break;
    } else {
      if (filterFn(list[prevIndex], prevIndex)) {
        return prevIndex;
      }
      prevIndex--;
    }
  }
  return -1;
}


// initialList may be a nodeList or an list,
// so we don't expect it to have any list methods
function wrapList(initialList) {

  var list = initialList || [];
  var self = {};
  var isLooping = false;

  // The Basics
  self.items = items;

  // add and remove are array-ONLY, if we're given a nodeList
  // it's immutable
  if (angular.isArray(list)) {
    self.add = add;
    self.remove = remove;
  }

  self.at = at;
  self.count = count;
  self.indexOf = indexOf;
  self.isInRange = isInRange;
  self.loop = loop;

  // The Crazy Ones
  self.delta = delta;
  self.isRelevant = isRelevant;
  self.previous = function(index, filterFn) {
    return listPrevious(list, isLooping, index, filterFn);
  };
  self.next = function(index, filterFn) {
    return listNext(list, isLooping, index, filterFn);
  };

  return self;

  // ***************
  // Public methods
  // ***************
  function items() {
    return list;
  }
  function add(item, index) {
    if (!self.isInRange(index)) index = list.length;
    list.splice(index, 0, item);

    return index;
  }

  function remove(index) {
    if (!self.isInRange(index)) return;
    list.splice(index, 1);
  }

  function at(index) {
    return list[index];
  }

  function count() {
    return list.length;
  }

  function indexOf(item) {
    for (var i = 0, ii = list.length; i < ii; i++) {
      if (list[i] === item) return i;
    }
    return -1;
  }

  function isInRange(index) {
    return index > -1 && index < list.length;
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
  // previous of that index, or the index next of that index.
  function isRelevant(index, someIndex) {
    return self.isInRange(index) && (
      index === someIndex ||
      index === self.previous(someIndex) ||
      index === self.next(someIndex)
    );
  }

}

})();
