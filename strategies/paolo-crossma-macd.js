// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).

var log = require('../core/log');

// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
  this.trend = 'none';
  this.requiredHistory = this.tradingAdvisor.historySize;

  const tulipMACDParameters = {
    optInFastPeriod: this.settings.MACD.fast,
    optInSlowPeriod: this.settings.MACD.slow,
    optInSignalPeriod: this.settings.MACD.signal,
  }

  const fastMA = {
    optInTimePeriod: this.settings.MACross.fast
  };

  const slowMA = {
    optInTimePeriod: this.settings.MACross.slow
  }; 

  this.addTulipIndicator('macd', 'macd', tulipMACDParameters);
  this.addTulipIndicator('fastMA', 'sma', fastMA);
  this.addTulipIndicator('slowMA', 'sma', slowMA);
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
strat.check = function() {

  log.debug(' CHECK PAOLO ');

  const fastMA = this.tulipIndicators.fastMA.result.result;
  const slowMA = this.tulipIndicators.slowMA.result.result;
  const macd = this.tulipIndicators.macd.result.macd;
  const macdSignal = this.tulipIndicators.macd.result.macdSignal;
  const macdHistogram = this.tulipIndicators.macd.result.macdHistogram
  
  log.debug(this.tulipIndicators.macd.result.macd);
  log.debug(this.tulipIndicators.macd.result.macdSignal);
  log.debug(this.tulipIndicators.macd.result.macdHistogram);
  log.debug(fastMA);
  log.debug(slowMA);

  const isMACDOverSignal = macd > macdSignal;
  const isFastUnderSlowMA = fastMA < slowMA;
  if(isMACDOverSignal)
  {
    if(macdHistogram > 0.0)
    {
      this.longIfNot();
    }
  }
  else
  {
    if(isFastUnderSlowMA)
    {
      this.shortIfNot();
    }
  }
}

strat.shortIfNot = function()
{  
  this.adviseIfNot('short');
}

strat.longIfNot = function()
{
  this.adviseIfNot('long');
}

strat.adviseIfNot = function(value)
{
  if(this.trend !== value)
  {
    log.debug('send advise %s', value);
    this.trend = value;
    this.advice(value);
  }
}
module.exports = strat;
