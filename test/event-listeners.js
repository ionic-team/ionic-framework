(function(window, document, ion) {

  // this file should not be apart of the build
  // its just just for testing that the correct
  // events are being triggered and at the correct
  // times, and so we don't have to hardcode/remove
  // console calls throughout the code
  
  ion.on('ready', function(){
    console.log('ready');
  });

  ion.on('initalized', function(){
    console.log('initalized');
  });

  ion.on('pageinit', function(e){
    console.log('pageinit:', e.detail);
  });

  ion.on('pageinitfailed', function(){
    console.log('pageinitfailed');
  });

  ion.on('pageloaded', function(e){
    console.log('pageloaded,', e.detail.data.url, ", Title:", e.detail.data.title);
  });

  ion.on('pagecreate', function(e){
    console.log('pagecreate,', e.detail.url);
  });

  ion.on('pageview', function(){
    console.log('pageview');
  });

  ion.on('pageremove', function(){
    console.log('pageremove');
  });


})(this, document, ion = ion.FM || {});