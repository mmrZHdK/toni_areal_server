'use strict';


var $ = require('jquery'),
    Backbone = require('backbone');

/**
 * global plugins
 */
require('./vendor/nouislider.js');
require('./vendor/masonry.js');

Backbone.$ = $;

var Router = require('./router');
var router = new Router();

Backbone.history.start();
