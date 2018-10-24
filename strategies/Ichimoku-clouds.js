let log = require('../core/log');
const IchimokuCloud = require('./indicators/ICHIMOKU-CLOUD.js');
const IchimokuCloudTypes = require('./indicators/ICHIMOKU-CLOUD-TYPES.js');
const TREND = IchimokuCloudTypes.TREND;
const CLOUD_COLOR = IchimokuCloudTypes.CLOUD_COLOR;

// Let's create our own strat
let strat = {};

// Prepare everything our method needs
strat.init = function() {
  this.name = 'Ichimoku Clouds';
  this.bought = false;
  this.lastPrice = 0;
  this.buyPrice = 0;
  this.maxPriceAfterBuy = 0;
  this.lastTrend = TREND.FLAT;  

  this.maxToCurrentSellRatio = this.settings.generic.maxToCurrentSellRatio;

  this.requiredHistory = this.tradingAdvisor.historySize;

  this.addIndicator('ichimokuCloud', 'ICHIMOKU-CLOUD', this.settings.ichimokuCloud);

  let demaSettings = { optInTimePeriod : this.settings.dema.period};
  this.addTulipIndicator('dema', 'dema', demaSettings);

  let emaSettings = { optInTimePeriod : this.settings.ema.period};
  this.addTulipIndicator('ema', 'ema', emaSettings);

  let dmSettings = { optInTimePeriod : this.settings.directionalMovementIndex.period};
  this.addTulipIndicator('dmi', 'dm', dmSettings);

  let maSettings = {} 
}

// What happens on every new candle?
strat.update = function(candle) {
}

// For debugging purposes.
strat.log = function() {
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
  const price = candle.close;
  
  const ichimokuCloud = this.indicators.ichimokuCloud;
  const trend = ichimokuCloud.getTrend();
  const color = ichimokuCloud.getCloudColor();
  const ichimokuResult = ichimokuCloud.result;

  let hasAdvised = false;
  if(this.bought)
  {
    this.maxPriceAfterBuy = Math.max(this.maxPriceAfterBuy, price);
    hasAdvised = this.checkSell(candle, trend, color, ichimokuResult);
  }
  else
  {
    hasAdvised = this.checkBuy(candle, trend, color, ichimokuResult);
  }

  if(!hasAdvised)
  {
    this.advice();
  }
}

strat.checkBuy = function(candle, trend, color, ichimokuResult)
{ 
  const demaResult = this.tulipIndicators.dema.result.result;
  const emaResult = this.tulipIndicators.ema.result.result;
  const dmiResult = this.tulipIndicators.dmi.result; // dmiPlus and dmLow


  const price = candle.close;
  let returnValue = false;

  if(trend === TREND.DOWN)
  {
    if(price > ichimokuResult.tenkanSen)     
    {
      returnValue = this.adviceBuy(candle);
    }
  }

  this.lastTrend = trend;
  return returnValue;
}

strat.checkSell = function(candle, trend, color, ichimokuResult)
{
  const demaResult = this.tulipIndicators.dema.result.result;
  const emaResult = this.tulipIndicators.ema.result.result;
  const dmiResult = this.tulipIndicators.dmi.result; // dmiPlus and dmLow

  const price = candle.close;

  if(trend === TREND.UP || (this.lastTrend === TREND.UP && trend === TREND.FLAT))
  {
    if(price < ichimokuResult.kijunSen)
    {
      return this.adviceSell(candle);
    }
  }

  return false;
}

strat.adviceBuy = function(candle)
{
  const price = candle.close;
  console.debug("Advise Buy " + price + " at " + candle.start.toString());
  this.bought = true;
  this.buyPrice = price;
  this.advice('long');

  return true;
}

strat.adviceSell = function(candle)
{
  const price = candle.close;
  console.debug("Advise Sell at " + candle.start.toString() + ". possible gain: " + (price/this.buyPrice));
  this.bought = false;
  this.buyPrice = 0;
  this.advice('short');

  return true;
}

module.exports = strat;
