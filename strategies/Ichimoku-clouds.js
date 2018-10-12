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

  this.maxToCurrentSellRatio = this.settings.maxToCurrentSellRatio;

  this.requiredHistory = this.tradingAdvisor.historySize;
  
  this.addIndicator('ichimokuCloud', 'ICHIMOKU-CLOUD', this.settings);
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
  const result = ichimokuCloud.result;

  let hasAdvised = false;
  if(this.bought)
  {
    this.maxPriceAfterBuy = Math.max(this.maxPriceAfterBuy, price);
    hasAdvised = this.checkSell(candle, trend, color, result);
  }
  else
  {
    hasAdvised = this.checkBuy(candle, trend, color, result);
  }

  if(!hasAdvised)
  {
    this.advice();
  }
}

strat.checkSell = function(candle, trend, color, result)
{
  const price = candle.close;
  if(trend === TREND.UP)
  {
    if(color === CLOUD_COLOR.GREEN)
    {
      if(result.tenkanSen < result.kijunSen && (price/this.maxPriceAfterBuy <= this.maxToCurrentSellRatio) ) // conversion line < base line and current price less than this.maxToCurrentSellRatio% max
      {
         return this.adviceSell(candle);
      }
    }
    else
    {
      // if(result.tenkanSen < result.kijunSen) ??
      return this.adviceSell(candle);
    }
  }
  else
  {
    if(trend < this.lastTrend)
    {
      return this.adviceSell(candle);
    }
    else
    {
      if(result.tenkanSen < result.kijunSen)
      {
        return this.adviceSell(candle);
      }
    }
  }

  return false;
}

strat.checkBuy = function(candle, trend, color, result)
{  
  const price = candle.close;
  if(trend === TREND.UP)
  {
    if(color === CLOUD_COLOR.GREEN)
    {
      if(result.tenkanSen > result.kijunSen) // conversion line > base line
      {
        return this.adviceBuy(candle);
      }
    }
    else
    {
      if (color === CLOUD_COLOR.GREEN) 
      {
        if (result.tenkanSen > result.kijunSen) // conversion line > base line
        {
          return this.adviceBuy(candle);
        }
      }
      else if(trend == TREND.FLAT)
      {
        if (result.tenkanSen > result.kijunSen && this.lastTrend === TREND.DOWN) // conversion line > base line
        {
          return this.adviceBuy(candle);
        }
      }
    }
  }

  this.lastTrend = trend;
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
