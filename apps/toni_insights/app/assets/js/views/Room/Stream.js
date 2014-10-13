'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),

    TextView = require('./Entries/Text'),
    PictureView = require('./Entries/Picture'),

    //Masonry = require('masonry')(window),
    template = require('../../templates/Room/Room--Stream.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click .stream-element': 'initDetailView'
  },

  initialize: function(options) {
    var id = options.parameter.id;

    this.collection.on('reset', this.render, this);

    this.collection.fetch({reset: true, data: {id: id}});
  },

  render: function() {
    console.log('render::Room--Stream');

    console.log();

    if (this.collection.length) {
      this.collection.each(_.bind(function(model) {

        var view = null;

        switch (model.attributes.entryType) {
          case 'text':
            view = new TextView({
              model: model
            });
            break;
          case 'picture':
            view = new PictureView({
              model: model
            })
            break;
        }

        view.$el.attr('data-model-id', model.attributes.id);
        view.$el.attr('data-model-type', model.attributes.entryType);

        this.$el.append(view.render().el);

      }, this));
    }
    else {
      this.$el.append(template(this.collection.toJSON()));
    }

    return this;
  },

  initDetailView: function(evt) {
    evt.preventDefault();

    var $el = $(evt.currentTarget);
    var modelId = $el.attr('data-model-id');
    var modelType = $el.attr('data-model-type');

    if (! $el.hasClass('is-open')) {
      $el.velocity({
        width: '100%',
      }, {
        duration: 300,
        complete: _.bind(function() {
          this.loadDetailView(modelId, modelType, $el);
          $el.addClass('is-open');
        }, this)
      });
    }
    else {
      this.unloadDetailView(modelId, modelType, $el);
      $el.velocity('reverse', {
        complete: _.bind(function() {
          $el.removeClass('is-open');
        }, this)
      });
    }

  },

  loadDetailView: function(id, type, $el) {
    switch (type) {
      case 'text':
        $el.find('.content-hidden').velocity('fadeIn');
        break;
    }
  },

  unloadDetailView: function(id, type, $el) {
    switch (type) {
      case 'text':
        $el.find('.content-hidden').velocity('fadeOut', { duration: 100 });
        break;
    }
  }

});
