// @link https://en.wikipedia.org/wiki/Ichimoku_Kink%C5%8D_Hy%C5%8D#Tenkan-sen
// @link http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:ichimoku_cloud
// TENKAN-SDN (Conversion Line)

const max = require('tulind').indicators.max;
const CircularBuffer = require('circular-buffer');

var Indicator = function (weight) {
  this.weight = weight;
  this.buffer = new CircularBuffer(weight); 
  this.maxValue = 0;
}

function maxCallback(err, results)
{
  console.debug('Result is %d', results[0][0]);
  maxValue = results[0][0];
}

Indicator.prototype.update = function (price) 
{
  this.buffer.push(price);
  max.indicator([this.buffer.toarray()], [this.buffer.size()], maxCallback);

  return maxValue;
}

Indicator.prototype.calculate = function (price) 
{
}

module.exports = Indicator;