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
  this.currentTrend = 'none';
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

  log.debug(' UPDATE PAOLO ');
}

// For debugging purposes.
strat.log = function() {
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {

  log.debug(' CHECK PAOLO ');

  var fastMA = this.tulipIndicators.fastMA;
  
  log.debug(this.tulipIndicators);
  log.debug(fastMA);
  log.debug(this.tulipIndicators.slowMA);

  // if(this.currentTrend === 'long') {

  //   // If it was long, set it to short
  //   this.currentTrend = 'short';
  //   this.advice('short');

  // } else {

  //   // If it was short, set it to long
  //   this.currentTrend = 'long';
  //   this.advice('long');

  // }
}

module.exports = strat;
