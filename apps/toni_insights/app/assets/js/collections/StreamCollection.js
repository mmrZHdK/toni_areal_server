'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Entry = require('../models/EntryModel');

Backbone.$ = $;

module.exports = Backbone.Collection.extend({
  url: 'http://insights.lukasgaechter.ch/api/stream/',
  model: Entry
});
