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
    'click .stream-element': 'initDetailView',
    'click .js-addEntry': 'loadUploadView'
  },

  collectionPosition: 0,
  streamInterval: 2000,

  initialize: function(options) {
    var id = options.parentAttributes.id;

    this.delegate = options.delegate;
    this.parentAttributes = options.parentAttributes;

    this.collection.on('reset', this.render, this);

    this.collection.fetch({reset: true, data: {id: id}});
  },

  render: function() {
    console.log('render::Room--Stream');

    var collectionLength = this.collection.length;

    if (this.collection.length > 0) {
      this.initStream();
      //this.collection.each(_.bind(this.renderStreamElement));
    }
    else {
      this.$el.append(template({
        parentAttributes: this.parentAttributes,
        collection: this.collection.toJSON()
      }));
    }

    this.makeGrid();

    return this;
  },

  initStream: function() {
    this.streamTimer = window.setInterval(_.bind(this.stream, this), this.streamInterval);
  },

  stream: function() {
    if ('undefined' !== typeof this.collection && this.collectionPosition < this.collection.length) {
      this.renderStreamElement(this.collection.at(this.collectionPosition));

      this.collectionPosition++;
    }
    else {
      /**
       * reached the end of the collection
       */
      this.disableStream();
    }
  },

  disableStream: function() {
    window.clearInterval(this.streamTimer);
  },

  renderStreamElement: function(model) {
    var view = null;

    console.log(model);

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
  },

  /**
   * Masonry Grid
   */
  makeGrid: function() {

    var width = $(window).width();

    this.$el.imagesLoaded( _.bind(function(){
        this.$el.masonry({
          itemSelector: '.stream-element',
          columnWidth: width/4
      });
    }, this));
  },

  initDetailView: function(evt) {
    evt.preventDefault();

    var $el = $(evt.currentTarget);
    var modelId = $el.attr('data-model-id');
    var modelType = $el.attr('data-model-type');

    if ($el.hasClass('img-container')) {
      $el = $el.parent();
    }

    console.log($el);

    if (! $el.hasClass('is-open')) {

      var newHeight = $el.hasClass('stream-element-picture') ? '100%' : 'auto';

      $el.data('initHeight', $el.height());

      $el.css({
        'height': newHeight,
        'z-index': 1000
      });

      $el.velocity({
        width: '100%',
        left: 0
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

          /**
           * reset css
           */
          $el.css({
            'height': $el.data('initHeight'),
            'z-index': 'auto'
          });

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
  },

  loadUploadView: function(evt) {
    evt.preventDefault();
    this.delegate.loadUploadView();
  }

});
