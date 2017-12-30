// @link http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:ichimoku_cloud

const MaxIndicator = require('tulind').indicators.max;
const MinIndicator = require('tulind').indicators.min;
const CircularBuffer = require('circular-buffer');

var Indicator = function (config) 
{
    // config must contain:
    // TENKAN-SEN (Conversion Line) period (default 9)
    // KIJUN-SEN (Base Line) period (default 26)
    // SENKOU-SPAN B (Leading Span B) period (default 52)
    // CHIKOU-SPAN (Lagging span) period (default 26)
    console.debug('ICHIMOKU-CLOUD using:');
    console.debug('TENKAN-SEN (Conversion Line) period %d', config.tenkansen);
    console.debug('KIJUN-SEN (Base Line) period %d', config.kijunsen);
    console.debug('SENKOU-SPAN B (Leading Span B) period %d', config.senkouspanb);
    console.debug('CHIKOU-SPAN (Lagging span) period %d', config.chikouspan);

    this.tenkanSen = new CircularBuffer(config.tenkansen);
    this.kijunSen = new CircularBuffer(config.kijunsen);
    this.senkouSpanB = new CircularBuffer(config.senkouspanb);
    this.chikouSpan = new CircularBuffer(config.chikouspan);
}

Indicator.prototype.computeTenkanSen = function()
{
    var maxVal = 0;
    var minVal = 0;
    var bufferAsArray = this.tenkanSen.toarray();
    var bufferSize = this.tenkanSen.size();
    MaxIndicator.indicator([bufferAsArray], [bufferSize], function(err, res) { maxVal = res[0][0];});
    MinIndicator.indicator([bufferAsArray], [bufferSize], function(err, res) { minVal = res[0][0];});

    return (maxVal + minVal) / 2;
}

Indicator.prototype.computeKijunSen = function()
{
    var maxVal = 0;
    var minVal = 0;
    var bufferAsArray = this.kijunSen.toarray();
    var bufferSize = this.kijunSen.size();
    MaxIndicator.indicator([bufferAsArray], [bufferSize], function(err, res) { maxVal = res[0][0];});
    MinIndicator.indicator([bufferAsArray], [bufferSize], function(err, res) { minVal = res[0][0];});

    return (maxVal + minVal) / 2;
}
Indicator.prototype.computeSenkouSpanA = function(tenkanSenValue, kijunSenValue)
{
    return (tenkanSenValue + kijunSenValue) / 2;
}

Indicator.prototype.computeSenkouSpanB = function()
{
    var maxVal = 0;
    var minVal = 0;
    var bufferAsArray = this.senkouSpanB.toarray();
    var bufferSize = this.senkouSpanB.size();
    MaxIndicator.indicator([bufferAsArray], [bufferSize], function(err, res) { maxVal = res[0][0];});
    MinIndicator.indicator([bufferAsArray], [bufferSize], function(err, res) { minVal = res[0][0];});

    return (maxVal + minVal) / 2;
}

Indicator.prototype.update = function (price) 
{
    this.tenkanSen.push(price);
    this.kijunSen.push(price);
    this.senkouSpanB.push(price);
    this.chikouSpan.push(price);

    var tenkanSenValue = this.computeTenkanSen();
    var kijunSenValue = this.computeKijunSen();
    var senkouSpanAValue = this.computeSenkouSpanA(tenkanSenValue, kijunSenValue);
    var senkousSpanBValue = this.computeSenkouSpanB();
    var chikouSpanValue = this.chikouSpan.get(this.chikouSpan.size() -1);

    this.result = { tenkanSen : tenkanSenValue, 
        kijunSen : kijunSenValue, 
        senkouSpanA : senkouSpanAValue, 
        senkouSpanB : senkousSpanBValue, 
        chikouSpan : chikouSpanValue};
}

Indicator.prototype.calculate = function (price) 
{
}

module.exports = Indicator;