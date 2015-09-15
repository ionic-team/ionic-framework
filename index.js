// Should already be required, here for clarity
require('angular');

// Load dependent libs
require('angular-animate');
require('angular-sanitize');
require('angular-ui-router');

// Now load ionic
require('./release/js/ionic');
require('./release/js/ionic-angular');

// Export namespace
module.exports = 'ionic';
