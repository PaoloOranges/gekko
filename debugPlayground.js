// Playground 

const TenkanSen = require('./strategies/indicators/TENKAN-SEN.js')
const tulind = require('tulind');

var tS = new TenkanSen(5);

tS.update(5);
tS.update(15);
tS.update(7);
tS.update(-15);
var result = tS.update(2);

console.log('result so far %d ', result);