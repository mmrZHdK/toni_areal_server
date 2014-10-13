'use strict';

var Backbone = require('backbone'),
    $ = require('jquery');

Backbone.$ = $;

var UserModel = Backbone.Model.extend({
  defaults: {
    searchValEbene: '',
    searchValGang: '',
    searchValRaum: ''
  }
});

module.exports = new UserModel();
