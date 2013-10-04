describe('Ionic Modal', function() {
  var modal, q;

  beforeEach(module('ionic.ui.modal'));

  beforeEach(inject(function(Modal, $q) {
    q = $q;
    modal = Modal;
  }));

  iit('Should show', function() {
    var template = '<div class="modal"></div>';
    var deferred = q.defer();
    modal.fromTemplate(template);
    deferred.resolve(true);
  });
});
