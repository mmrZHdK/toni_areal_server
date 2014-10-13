'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Room = require('../models/RoomModel');

Backbone.$ = $;

module.exports = Backbone.Collection.extend({
  url: './api/search/',
  model: Room
});
