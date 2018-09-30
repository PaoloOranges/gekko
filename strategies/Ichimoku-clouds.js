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

  if(this.bought)
  {
    this.maxPriceAfterBuy = Math.max(this.maxPriceAfterBuy, price);
    this.checkSell(price, trend, color, result);
  }
  else
  {
    this.checkBuy(price, trend, color, result);
  }

}

strat.checkSell = function(price, trend, color, result)
{
  if(trend === TREND.UP)
  {
    if(color === CLOUD_COLOR.GREEN)
    {
      if(result.tenkanSen < result.kijunSen && (price/this.maxPriceAfterBuy <= 0.95) ) // conversion line < base line and current price less than 95% max
      {
        this.adviceSell(price);
      }
    }
    else
    {
      // if(result.tenkanSen < result.kijunSen) ??
      this.adviceSell(price);
    }
  }
  else
  {
    if(trend < this.lastTrend)
    {
      this.adviceSell(price);
    }
    else
    {
      if(result.tenkanSen < result.kijunSen)
      {
        this.adviceSell(price);
      }
    }
  }
}

strat.checkBuy = function(price, trend, color, result)
{  
  if(trend === TREND.UP)
  {
    if(color === CLOUD_COLOR.GREEN)
    {
      if(result.tenkanSen > result.kijunSen) // conversion line > base line
      {
        this.adviceBuy(price);
      }
    }
    else
    {
      if (color === CLOUD_COLOR.GREEN) 
      {
        if (result.tenkanSen > result.kijunSen) // conversion line > base line
        {
          this.adviceBuy(price);
        }
      }
      else if(trend == TREND.FLAT)
      {
        if (result.tenkanSen > result.kijunSen && this.lastTrend === TREND.DOWN) // conversion line > base line
        {
          this.adviceBuy(price);
        }
      }
    }
  }

  this.lastTrend = trend;
}

strat.adviceBuy = function(price)
{
  console.debug("Advise Buy");
  this.bought = true;
  this.buyPrice = price;
}

strat.adviceSell = function(price)
{
  console.debug("Advise Sell. possible gain: " + (price/this.buyPrice));
  this.bought = false;
  this.buyPrice = 0;
}

module.exports = strat;
