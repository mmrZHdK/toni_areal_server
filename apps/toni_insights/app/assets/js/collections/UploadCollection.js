'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    Upload = require('../models/UploadModel');

Backbone.$ = $;

module.exports = Backbone.Collection.extend({
  model: Upload
});
