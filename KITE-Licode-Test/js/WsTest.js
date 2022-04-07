const {TestUtils, WebDriverFactory, KiteBaseTest, ScreenshotStep} = require('./node_modules/kite-common'); 
const {OpenUrlStep, GetStatsStep, LeaveRoomStep} = require('./steps');
const {PublishedVideoCheck, SubscribedVideoCheck, PublishedAudioOnlyCheck, SubscribedAudioOnlyCheck} = require('./checks');
const {MainPage} = require('./pages');

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

class LicodeTest extends KiteBaseTest {
  constructor(name, kiteConfig) {
    super(name, kiteConfig);
    this.licodeOptions = this.payload.configOptions;
  }
  
  async testScript() {
    try {
      // this.driver = await WebDriverFactory.getDriver(this.capabilities, this.remoteUrl);
      this.driver = await WebDriverFactory.getDriver(this.capabilities);

      this.page = new MainPage(this.driver);
      let openUrlStep = new OpenUrlStep(this, randomIntFromInterval(1, this.payload.roomsCount), true);
      
      await openUrlStep.execute(this);

      await new Promise(r => setTimeout(r, this.payload.stayInRoomSec * 1000));

      let leaveRoomStep = new LeaveRoomStep(this);
      await leaveRoomStep.execute(this);

      await this.waitAllSteps();

    } catch (e) {
      console.log(e);
    } finally {
      if (this.driver) {
        await this.driver.quit();
      }
    }
  }
}

module.exports= LicodeTest;

(async () => {
  const kiteConfig = await TestUtils.getKiteConfig(__dirname);
  let test = new LicodeTest('LicodeTest test', kiteConfig);
  await test.run();
})();
