'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    template = require('../../templates/Header/Button.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  tagName: 'a',
  className: 'header-button',

  events: {
    'click': 'clickAction'
  },

  initialize: function(options) {
    this.options = options;
    this.$el.addClass('icon-' + options.iconName);
    this.$el.attr('href', '#');
  },

  render: function() {
    this.$el.html();
    return this;
  },

  setState: function(state) {
    this.state = state;
  },

  getState: function() {
    return this.state;
  },

  clickAction: function(evt) {
    evt.preventDefault();
    this.options.buttonAction(evt);
  }

});
