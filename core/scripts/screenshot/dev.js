const IonicConnector = require('./ionic');

class DevConnector extends IonicConnector {

  async pullMasterBuild() {
    await super.pullIonicMasterBuild();

    const masterBuild = await super.getMasterBuild();
    await this.generateJsonpDataUris(masterBuild);
  }

}

module.exports = DevConnector;
