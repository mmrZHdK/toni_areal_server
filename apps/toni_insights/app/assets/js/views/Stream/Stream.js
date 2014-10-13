'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),

    template = require('../../templates/Stream/Stream.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function() {
    console.log('render::StreamView');
    this.render();
  },

  render: function() {
    this.$el.html(template());

    return this;
  }

});
