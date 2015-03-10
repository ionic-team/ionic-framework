describe('ionic.workers', function() {


  beforeEach(inject(function($timeout) {
    // Expose so the worker can use
    ionic.$timeout = $timeout;

    var WORKER_STR = function() {
      onmessage = function(ev) {
        ionic.$timeout(function() {
          postMessage({
            response: 'done. your message was ' + ev.data.message,
            id: ev.data.id
          });
        }, ev.data.delay || 100);
      }
    }.toString().replace(/^.*?{/, '').replace(/}$/, '').trim();

    ionic.workers.nativeSupport = false;
    ionic.WORKER_SCRIPTS.myWorker = WORKER_STR;
  }));
  afterEach(function() {
    delete ionic.$timeout;
  });

  it('should get a worker with a valid name', function() {
    var worker = ionic.workers.get('myWorker');
    expect(typeof worker.send).toBe('function');
  });

  it('should error if getting a worker with invalid name', function() {
    expect(function() {
      ionic.workers.get('invalid');
    }).toThrow();
  });

  it('should send a message and respond with callback', inject(function($timeout) {
    var responseSpy = jasmine.createSpy('response');
    var worker = ionic.workers.get('myWorker');
    worker.send({
      message: 'work!',
      delay: 95
    }, responseSpy);
    expect(responseSpy).not.toHaveBeenCalled();
    $timeout.flush(95);
    expect(responseSpy).toHaveBeenCalled();
    expect(responseSpy.mostRecentCall.args[0].data.response).toBe('done. your message was work!');
  }));

  it('should properly respond to multiple messages', inject(function($timeout) {
    var worker = ionic.workers.get('myWorker');
    var responseSpies = [
      jasmine.createSpy('response1'),
      jasmine.createSpy('response2'),
      jasmine.createSpy('response3')
    ];
    for (var i = 0; i < 3; i++) {
      worker.send({
        message: 'work' + i ,
        delay: 90 + i
      }, responseSpies[i]);
    }
    $timeout.flush(90);
    expect(responseSpies[0]).toHaveBeenCalled();
    expect(responseSpies[1]).not.toHaveBeenCalled();
    expect(responseSpies[2]).not.toHaveBeenCalled();
    expect(responseSpies[0].mostRecentCall.args[0].data.response).toBe('done. your message was work0');

    $timeout.flush();

    expect(responseSpies[0]).toHaveBeenCalled();
    expect(responseSpies[0].callCount).toBe(1);
    expect(responseSpies[1]).toHaveBeenCalled();
    expect(responseSpies[1].callCount).toBe(1);
    expect(responseSpies[2]).toHaveBeenCalled();
    expect(responseSpies[2].callCount).toBe(1);
    expect(responseSpies[1].mostRecentCall.args[0].data.response).toBe('done. your message was work1');
    expect(responseSpies[2].mostRecentCall.args[0].data.response).toBe('done. your message was work2');
  }));

});
