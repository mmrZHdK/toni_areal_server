'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click .js-roomSearch': 'roomSearch',
  },

  initialize: function() {
    this.render();
  },

  render: function(ViewObj) {
    this.$el.html();
    return this;
  }

});
