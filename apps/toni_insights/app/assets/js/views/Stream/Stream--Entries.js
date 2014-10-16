'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),

    template = require('../../templates/Stream/Stream--Entries.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function(options) {
    this.delegate = options.delegate;
  },

  render: function(rooms) {
    this.$el.html(rooms.join(', '));
    return this;
  }

});
