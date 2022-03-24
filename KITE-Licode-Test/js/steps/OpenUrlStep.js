const {TestStep} = require('kite-common');

class OpenUrlStep extends TestStep {
  constructor(kiteBaseTest, roomId) {
    super();
    this.driver = kiteBaseTest.driver;
    this.timeout = kiteBaseTest.timeout;
    this.url = kiteBaseTest.url;
    this.uuid = kiteBaseTest.uuid;
    this.page = kiteBaseTest.page;
    this.reporter = kiteBaseTest.reporter;
    this.options = kiteBaseTest.licodeOptions;
    this.roomId = roomId;
  }

  stepDescription() {
    return 'Open ' + this.url + '';
  }

  async step() {
    this.url += '/?room=' + this.roomId;
    await this.page.open(this);
    if (this.options) {
      this.reporter.textAttachment(this.report, "Options set", JSON.stringify(this.options), "plain");
      await this.page.setBasicExampleOptions(this);
    }
    //await this.page.clickStart(this);
    await this.page.waitForVideos(this);
  }
}

module.exports = OpenUrlStep;
