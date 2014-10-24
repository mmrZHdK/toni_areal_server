'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    config = require('../config'),
    Entry = require('../models/EntryModel');

Backbone.$ = $;

module.exports = Backbone.Collection.extend({
  url: config.baseUrl + '/api/stream/',
  model: Entry
});
