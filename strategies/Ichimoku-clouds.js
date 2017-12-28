var log = require('../core/log');
const IchimokuCloud = require('./indicators/ICHIMOKU-CLOUD.js');

// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
  this.name = 'Ichimoku Clouds';

  this.addIndicator('IchimokuCloud', 'ICHIMOKU-CLOUD', this.settings);
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
  
}

module.exports = strat;
