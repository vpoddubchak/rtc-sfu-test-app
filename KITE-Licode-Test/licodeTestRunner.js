const child_process = require('child_process');
const { KiteConfig, KiteTest } = require('./utils/testUtils')
const fs = require('fs');
var bodyParser = require('body-parser')
const express = require('express');
const { fstat } = require('fs');
const app = express();
const port = 5001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const configPath = './configs'
let configIndex = 1;

const runTestConfig = (configFile) => {
  console.log('Will run test', configFile);
  var script =`kite_r ${configFile}`; 
  result = child_process.execSync(script,  {
    maxBuffer: 1000 * 1024,
    shell: '/bin/bash',
  });
  console.log('Ended test', configFile);
  console.log('Result ', result.toString());
};

const removeTestConfig = (configFile) => {
  fs.rmSync(configFile);
};

app.post('/startTest', async (req, res) => {
  try {
    const config = new KiteConfig('KiteConfig');
    config.addGridHub('http://localhost:4444/wd/hub');
    if (req.body.chrome) {
      config.addChrome();
    }
    if (req.body.firefox) {
      config.addFirefox();
    }

    const test = new KiteTest(req.body.name, req.body.url);
    test.setRoomsCount(req.body.roomsCount);
    test.setRoomsCount(req.body.stayInRoomSec);
    test.setOnlyAudio(req.body.parameters.onlyAudio);
    test.setSimulcast(req.body.parameters.simulcast);
    if (req.body.parameters.p2p) {
      test.setType('p2p');
    }
    config.addTest(test);

    const configName = `${configPath}/config${configIndex}.json`
    config.writeToFile(configName);
    configIndex++;

    if (req.body.sync) {
      runTestConfig(configName);
      res.send(req.body);
    } else {
      res.send(req.body);
      runTestConfig(configName);
    }

    removeTestConfig(configName);
  } catch (e) {
    res.status(400).send(e.toString())
  }

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});
