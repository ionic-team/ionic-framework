const LocalScreenshotConnector = require('./local');
const fs = require('fs');
const path = require('path');


class CIScreenshotConnector extends LocalScreenshotConnector {

  async publishBuild() {
    const timespan = this.logger.createTimeSpan(`publishing build started`);

    timespan.finish(`publishing build finished`);
  }

}

module.exports = CIScreenshotConnector;
