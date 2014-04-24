function MainCtrl($scope, $ionicScrollDelegate, filterFilter) {
  var letters = $scope.letters = [];
  var contacts = $scope.contacts = [];
  var currentCharCode = 'A'.charCodeAt(0) - 1;

  window.CONTACTS
    .sort(function(a, b) {
      return a.last_name > b.last_name ? 1 : -1;
    })
    .forEach(function(person) {
      var personCharCode = person.last_name.toUpperCase().charCodeAt(0);
      var difference = personCharCode - currentCharCode;
      for (var i = 1; i <= difference; i++) {
        addLetter(currentCharCode + i);
      }
      currentCharCode = personCharCode;
      contacts.push(person);
    });

  for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i);
  }

  function addLetter(code) {
    var letter = String.fromCharCode(code);
    contacts.push({
      isLetter: true,
      letter: letter
    });
    letters.push(letter);
  }

  $scope.getContacts = function() {
    return contacts.filter(function(item) {
      return !$scope.search || item.isLetter ||
        item.first_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 ||
        item.last_name.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;
    });
  };

  $scope.goToLetter = function(letter) {
    var scrollValue = 0;
    var contacts = $scope.getContacts();
    for (var i = 0, ii = contacts.length; i < ii; i++) {
      if (contacts[i].isLetter && contacts[i].letter === letter) {
        break;
      }
      scrollValue += $scope.getHeight(contacts[i]);
    }
    $ionicScrollDelegate.scrollTo(0, scrollValue);
  };

  $scope.getHeight = function(item) {
    return item.isLetter ? 38 : 52;
  };
}
