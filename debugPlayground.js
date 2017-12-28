// Playground 

const IchimokuCloud = require('./strategies/indicators/ICHIMOKU-CLOUD.js')
const tulind = require('tulind');
const util = require('util')

var config = {
    tenkansen : 9,
    kijunsen : 26,
    senkouspanb : 52,
    chickouspan : 26
}

var tS = new IchimokuCloud(config);

tS.update(5);
tS.update(15);
tS.update(7);
tS.update(-6);
var result = tS.update(2);

// alternative shortcut
console.log(util.inspect(result, false, null))