'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    Helper = require('../../helpers/helper'),

    TextView = require('../Entry/Text'),
    PictureView = require('../Entry/Picture');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click .stream-element': 'initDetailView'
  },

  collectionPosition: 0,
  streamInterval: 2000,
  loadedIds: [],

  initialize: function(options) {
    this.delegate = options.delegate;

    this.initStream();

    this.collection.on('reset', this.resetStream, this);
  },

  render: function() {
    this.makeGrid();
    return this;
  },

  initStream: function() {
    this.streamTimer = window.setInterval(_.bind(this.stream, this), this.streamInterval);
    console.log('Collection Length: ' + this.collection.length);

    this.loadedIds = [];
  },

  disableStream: function() {
    window.clearInterval(this.streamTimer);
  },

  /**
   * render elements if there is data and we didn’t already move all through the collection
   */
  stream: function() {
    if (this.collection.length > 0) {
      if ('undefined' !== typeof this.collection && this.collectionPosition < this.collection.length) {
        this.renderStreamElement(this.collection.at(this.collectionPosition));
        this.collectionPosition++;
      }
    }
  },

  resetStream: function() {
    this.collectionPosition = 0;
  },

  renderStreamElement: function(model) {
    var view = null;

    var size = Helper.generateSize();

    switch (model.attributes.entryType) {
      case 'text':
        view = new TextView({
          model: model,
          className: 'stream-element stream-element-text',
          size: size,
          delegate: {
            reloadGrid: _.bind(this.reloadGrid, this),
          }
        });
        break;
      case 'picture':
        view = new PictureView({
          model: model,
          className: 'stream-element stream-element-picture',
          size: size,
          delegate: {
            reloadGrid: _.bind(this.reloadGrid, this)
          }
        })
        break;
    }

    view.$el.attr('data-model-id', model.attributes.id);
    view.$el.attr('data-model-type', model.attributes.entryType);

    this.$el.prepend(view.render().el);
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

  reloadGrid: function() {
    this.$el.masonry('reload');
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
