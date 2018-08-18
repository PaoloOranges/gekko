// @link http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:ichimoku_cloud

const MaxIndicator = require('tulind').indicators.max;
const MinIndicator = require('tulind').indicators.min;
const CircularBuffer = require('circular-buffer');

let Indicator = function (config) 
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

    const bufferSize = Math.max(config.tenkansen, config.kijunsen, config.senkouspanb, config.chikouspan);
    this.config = config;

    this.priceBuffer = new CircularBuffer(bufferSize);
}

function getArrayFrom(buffer, arraySize)
{
    const endIndex = buffer.size() - 1;
    const startIndex = Math.max(0, (endIndex - arraySize)+1); // get return from start to end both included
    return buffer.get(startIndex, endIndex);
}

Indicator.prototype.getTenkanSenBuffer = function()
{
    return getArrayFrom(this.priceBuffer, this.config.tenkansen);
}

Indicator.prototype.getKijunSenBuffer = function()
{
    return getArrayFrom(this.priceBuffer, this.config.kijunsen);
}

Indicator.prototype.getSenkouSpanBBuffer = function()
{
    return getArrayFrom(this.priceBuffer, this.config.senkouspanb);
}

Indicator.prototype.getChikouSpan = function()
{
    const valIndex = Math.min((this.config.chikouspan - 1), (this.priceBuffer.size() - 1));
    return this.priceBuffer.get(valIndex);
}

Indicator.prototype.computeLine = function(bufferAsArray)
{
    var maxVal = 0;
    var minVal = 0;
    const bufferSize = bufferAsArray.length;
    MaxIndicator.indicator([bufferAsArray], [bufferSize], (err, res) => { maxVal = res[0][0];});
    MinIndicator.indicator([bufferAsArray], [bufferSize], (err, res) => { minVal = res[0][0];});

    return (maxVal + minVal) / 2;
}

Indicator.prototype.computeTenkanSen = function()
{
    return this.computeLine(this.getTenkanSenBuffer());
}

Indicator.prototype.computeKijunSen = function()
{
    return this.computeLine(this.getKijunSenBuffer());
}
Indicator.prototype.computeSenkouSpanA = function(tenkanSenValue, kijunSenValue)
{
    return (tenkanSenValue + kijunSenValue) / 2;
}

Indicator.prototype.computeSenkouSpanB = function()
{
    return this.computeLine(this.getSenkouSpanBBuffer());
}

Indicator.prototype.update = function (price) 
{
    this.priceBuffer.push(price);

    const tenkanSenValue = this.computeTenkanSen();
    const kijunSenValue = this.computeKijunSen();
    const senkouSpanAValue = this.computeSenkouSpanA(tenkanSenValue, kijunSenValue);
    const senkousSpanBValue = this.computeSenkouSpanB();
    const chikouSpanValue = this.getChikouSpan();
    const trendValue = this.calculateTrend(price, senkouSpanAValue, senkousSpanBValue);

    this.result = { tenkanSen : tenkanSenValue, 
        kijunSen : kijunSenValue, 
        senkouSpanA : senkouSpanAValue, 
        senkouSpanB : senkousSpanBValue, 
        chikouSpan : chikouSpanValue,
        trend : trendValue};
}

Indicator.prototype.calculate = function (price) 
{
}

Indicator.prototype.calculateTrend = function (price, senkouSpanAValue, senkouSpanBValue) 
{
    if(price > senkouSpanAValue)
    {
        if(price > senkouSpanBValue)
        {
            return "UP";
        }
        else
        {
            return "FLAT";
        }
    }
    else
    {
        if(price > senkouSpanBValue)
        {
            return "FLAT";
        }
        else
        {
            return "DOWN";
        }
    }
}

// distance SpanA - SpanB 
Indicator.prototype.getCloudSize = function()
{
    return this.result.senkouSpanA - this.result.senkouSpanB;
}

// Diff in SpanA-SpanB > 0, green cloud. Red otherwise.
Indicator.prototype.getCloudColor = function()
{
    return this.getCloudSize() > 0 ? "GREEN" : "RED";
}

// Diff in SpanA-SpanB > 0, green cloud. Red otherwise.
Indicator.prototype.getTrend = function()
{
    return this.result.trend;
}

module.exports = Indicator;