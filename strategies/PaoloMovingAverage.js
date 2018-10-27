let log = require('../core/log');

// Let's create our own strat
let strat = {};

strat.init = function () {
    this.name = 'Ichimoku Clouds';
    this.bought = false;
    this.lastPrice = 0;
    this.buyPrice = 0;
    this.maxPriceAfterBuy = 0;

    //this.maxToCurrentSellRatio = this.settings.generic.maxToCurrentSellRatio;

    this.requiredHistory = this.tradingAdvisor.historySize;

    let smaSettings = { optInTimePeriod: 108 };
    this.addTulipIndicator('sma', 'sma', smaSettings);

    let demaSettings = { optInTimePeriod: 108 };
    this.addTulipIndicator('dema', 'dema', demaSettings);

}

// What happens on every new candle?
strat.update = function (candle) {
}

// For debugging purposes.
strat.log = function () {
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
    const demaResult = this.tulipIndicators.dema.result.result;
    const smaResult = this.tulipIndicators.sma.result.result;

    const price = candle.close;
    let returnValue = false;

    if (demaResult < smaResult && (price - demaResult) > 0.2*(smaResult - demaResult)) {
        returnValue = this.adviceBuy(candle);
    }

    return returnValue;
}

strat.checkSell = function (candle) {
    const demaResult = this.tulipIndicators.dema.result.result;
    const smaResult = this.tulipIndicators.sma.result.result;
    const price = candle.close;

    if(price > 1.3*this.buyPrice)
    {
        return this.adviceSell(candle);
    }

    if (demaResult > smaResult && (demaResult - price) > 0.1*(demaResult - smaResult)) {
        return this.adviceSell(candle);
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