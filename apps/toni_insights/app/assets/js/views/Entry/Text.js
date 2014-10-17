'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),

    template = require('../../templates/Entry/Text.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click': 'initDetailView',
  },

  initHeight: 0,

  initialize: function(options) {
    this.$el.css({
      width: options.size.width,
      height: options.size.height
    });

    this.delegate = options.delegate;
  },

  render: function() {
    this.$el.attr('data-id', this.model.attributes.id);

    this.$el.css({
      color: this.model.attributes.textColor,
      background: this.model.attributes.textBackground
    });

    this.$el.html(template(this.model.attributes));

    return this;
  },

  initDetailView: function(evt) {
    evt.preventDefault();

    if (this.initHeight !== 0) {
      this.initHeight = this.$el.css('height');
    }

    var $el = this.$el;
    var modelId = $el.attr('data-model-id');
    var modelType = $el.attr('data-model-type');

    if ($el.hasClass('img-container')) {
      $el = $el.parent();
    }

    if (! $el.hasClass('is-open')) {

      $el.css({
        height: 'auto',
        'z-index': 1000
      });

      $el.velocity({
        width: '100%',
        left: 0
      }, {
        duration: 250,
        complete: _.bind(function() {

          $el.addClass('is-open');
          this.delegate.reloadGrid();

        }, this)
      });

      this.loadDetailView($el);
    }
    else {
      this.unloadDetailView($el);

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

  loadDetailView: function($el) {
    $el.find('.content-hidden').velocity('fadeIn', {
      duration: 250,
      complete: _.bind(function() {
        this.delegate.reloadGrid();
      }, this)
    });
  },

  unloadDetailView: function($el) {
    $el.find('.content-hidden').velocity('fadeOut', { duration: 100 });
  }

});
