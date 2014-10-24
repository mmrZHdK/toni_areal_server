'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    config = require('../config'),
    Room = require('../models/RoomModel');

Backbone.$ = $;

module.exports = Backbone.Collection.extend({
  url: config.baseUrl + '/api/room/',
  model: Room
});
