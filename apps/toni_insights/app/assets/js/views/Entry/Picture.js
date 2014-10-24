'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    config = require('../../config'),
    template = require('../../templates/Entry/Picture.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  width: 0,
  height: 0,

  events: {
    'click': 'initDetailView',
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.$el.css({
      width: options.size.width,
      height: options.size.height
    });
  },

  render: function() {

    this.model.attributes.baseUrl = config.baseUrl;

    this.$el.html(template(this.model.attributes));

    this.$('.img-container').getBackgroundSize(_.bind(function(dimensions) {
      this.width = dimensions.width;
      this.height = dimensions.height;
    }, this));

    return this;
  },

  initDetailView: function(evt) {
    evt.preventDefault();

    var $el = this.$el;

    if ($el.hasClass('img-container')) {
      $el = $el.parent();
    }

    if (! $el.hasClass('is-open')) {

      $el.css({
        'z-index': 1000
      });

      $el.velocity({
        width: '100%',
        height: this.height/this.width * 100 + 'vw',
        left: 0
      }, {
        duration: 300,
        complete: _.bind(function() {

          $el.addClass('is-open');
          this.delegate.reloadGrid();

        }, this)
      });
    }
    else {

      $el.css({
        'z-index': 0
      });

      $el.velocity('reverse', {
        complete: _.bind(function() {

          $el.removeClass('is-open');
          this.delegate.reloadGrid();

        }, this)
      });
    }
  },

});
