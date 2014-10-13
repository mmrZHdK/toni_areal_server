'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Entry = require('../models/EntryModel');

Backbone.$ = $;

module.exports = Backbone.Collection.extend({
  url: './api/entries/',
  model: Entry
});
