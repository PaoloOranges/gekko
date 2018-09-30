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
  let price = candle.close;
  
  if(this.bought)
  {
    this.checkSell(price);
  }
  else
  {
    this.checkBuy(price);
  }

}

strat.checkSell = function(price)
{
  
}

strat.checkBuy = function(price)
{
  
  const ichimokuCloud = this.indicators.ichimokuCloud;
  const trend = ichimokuCloud.getTrend();
  const color = ichimokuCloud.getCloudColor();
  const result = ichimokuCloud.result;

  if(trend === TREND.UP)
  {
    if(color === CLOUD_COLOR.GREEN)
    {
      if(result.tenkanSen > result.kijunSen) // conversion line > base line
      {
        this.adviceBuy();
      }
    }
    else
    {
      if (color === CLOUD_COLOR.GREEN) 
      {
        if (result.tenkanSen > result.kijunSen) // conversion line > base line
        {
          this.adviceBuy();
        }
      }
      else if(trend == TREND.FLAT)
      {
        if (result.tenkanSen > result.kijunSen && this.lastTrend === TREND.DOWN) // conversion line > base line
        {
          this.adviceBuy();
        }
      }
    }
  }

  this.lastTrend = trend;
}

strat.adviceBuy = function()
{
  console.debug("Advise Buy");
  this.bought = true;
}

module.exports = strat;
