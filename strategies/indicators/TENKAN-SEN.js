// @link https://en.wikipedia.org/wiki/Ichimoku_Kink%C5%8D_Hy%C5%8D#Tenkan-sen
// @link http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:ichimoku_cloud
// TENKAN-SDN (Conversion Line). default period 9

const max = require('tulind').indicators.max;
const min = require('tulind').indicators.min;
const CircularBuffer = require('circular-buffer');

var Indicator = function (wightPeriod) 
{
  this.buffer = new CircularBuffer(wightPeriod); 
  this.maxValue = 0;
  this.minValue = 0;
}

function maxCallback(err, results)
{
  console.debug('Max Callback Result is %d', results[0][0]);
  maxValue = results[0][0];
}

function minCallback(err, results)
{
  console.debug('Min Callback Result is %d', results[0][0]);
  minValue = results[0][0];
}

Indicator.prototype.update = function (price) 
{
  this.buffer.push(price);
  var bufferAsArray = this.buffer.toarray();
  var bufferSize = this.buffer.size();
  max.indicator([bufferAsArray], [bufferSize], maxCallback);
  min.indicator([bufferAsArray], [bufferSize], minCallback);

  return (maxValue + minValue) / 2;
}

Indicator.prototype.calculate = function (price) 
{
}

module.exports = Indicator;