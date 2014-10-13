'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    template = require('../templates/Main.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  id: '#vMain',
  className: 'container-content',

  events: {
    'click .js-roomSearch': 'roomSearch',
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.render();
  },

  render: function(ViewObj, attributes) {

    this.$el.html(template());

    if ('undefined' === typeof attributes) {
      attributes = {};
    }

    if ('undefined' !== typeof ViewObj) {
      attributes.el = $('.vMainContent');
      var view = new ViewObj(attributes);
    }

    return this;
  }

});
