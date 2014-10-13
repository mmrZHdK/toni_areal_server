'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),

    template = require('../../templates/Loader/Loader.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function(options) {
    this.delegate = options.delegate;
    var loadingTimer = window.setTimeout(_.bind(this.loadPositionFail, this), 1000);
  },

  render: function() {
    console.log('render::LoaderView');

    this.$el.html(template());

    return this;
  },

  loadPositionFail: function() {
    this.delegate.loadFailure(true);
  }

});
