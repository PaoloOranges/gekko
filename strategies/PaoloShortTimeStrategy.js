let log = require('../core/log');

// Let's create our own strat
let strat = {};

strat.init = function () {
    this.name = 'Short Time Strategy';
    this.bought = false;
    this.lastPrice = 0;
    this.buyPrice = 0;
    this.maxPriceAfterBuy = 0;
    this.maxSlope = 0
    this.minSlope = 0

    //this.maxToCurrentSellRatio = this.settings.generic.maxToCurrentSellRatio;

    this.requiredHistory = this.tradingAdvisor.historySize;

    let smaSettings = { optInTimePeriod: 36 };
    this.addTulipIndicator('sma', 'sma', smaSettings);

    let demaSettings = { optInTimePeriod: 9 };
    this.addTulipIndicator('dema', 'dema', demaSettings);

    let timeSeriesForecastSettings = { optInTimePeriod: 21 };
    this.addTulipIndicator('tsf', 'tsf', timeSeriesForecastSettings);

    let linearRegressionSlopeSettings = { optInTimePeriod: 18 };
    this.addTulipIndicator('linregslope', 'linregslope', linearRegressionSlopeSettings);
}

// What happens on every new candle?
strat.update = function (candle) {
}

// For debugging purposes.
strat.log = function () {
}

resetMaxMinSlope = function(stratObject){
    stratObject.maxSlope = 0;
    stratObject.minSlope = 0;
}

strat.check = function (candle) {
    const price = candle.close;

    let hasAdvised = false;
    if (this.bought) {
        this.maxPriceAfterBuy = Math.max(this.maxPriceAfterBuy, price);
        hasAdvised = this.checkSell(candle);
    }
    else {
        hasAdvised = this.checkBuy(candle);
    }

    if (!hasAdvised) {
        this.advice();
    }
}

strat.checkBuy = function (candle) {
    const price = candle.close;
    const smaResult = this.tulipIndicators.sma.result.result;
    const tsfResult = this.tulipIndicators.tsf.result.result;
    const slopeResult = this.tulipIndicators.linregslope.result.result;

    if(tsfResult < smaResult && price >= tsfResult && slopeResult > 0.7*this.minSlope)
    {
        resetMaxMinSlope(this);
        return this.adviceBuy(candle);
    }

    if(Math.abs(slopeResult) > 5) {
        this.minSlope = Math.min(this.minSlope, slopeResult);
    }
    
    return false;
}

strat.checkSell = function (candle) {
    const price = candle.close;
    const smaResult = this.tulipIndicators.sma.result.result;
    const tsfResult = this.tulipIndicators.tsf.result.result;
    const slopeResult = this.tulipIndicators.linregslope.result.result;

    if(tsfResult > smaResult && slopeResult <= 0.7*this.maxSlope)
    {
        resetMaxMinSlope(this);
        return this.adviceSell(candle);;
    }

    if(Math.abs(slopeResult) > 5) {
        this.maxSlope = Math.max(slopeResult, this.maxSlope);
    }
    

    return false;
}

strat.adviceBuy = function (candle) {
    const price = candle.close;
    console.debug("Advise Buy " + price + " at " + candle.start.toString());
    this.bought = true;
    this.buyPrice = price;
    this.advice('long');

    return true;
}

strat.adviceSell = function (candle) {
    const price = candle.close;
    console.debug("Advise Sell at " + candle.start.toString() + ". possible gain: " + (price / this.buyPrice));
    this.bought = false;
    this.buyPrice = 0;
    this.advice('short');

    return true;
}


module.exports = strat;