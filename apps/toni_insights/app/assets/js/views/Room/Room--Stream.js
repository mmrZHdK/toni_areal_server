'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    Helper = require('../../helpers/helper'),

    TextView = require('../Entry/Text'),
    PictureView = require('../Entry/Picture'),

    //Masonry = require('masonry')(window),
    template = require('../../templates/Room/Room--Stream.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click .js-addEntry': 'loadUploadView'
  },

  streamViews: [],

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
      this.collection.each(_.bind(this.renderStreamElement, this));
      this.makeGrid();
    }
    else {
      this.$el.append(template({
        parentAttributes: this.parentAttributes,
        collection: this.collection.toJSON()
      }));
    }



    return this;
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
            closeOpenViews: _.bind(this.closeOpenViews, this)
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
        });
        break;
    }

    console.log(model.attributes.id);

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
          columnWidth: width/4,
          isAnimated: false
      });
    }, this));
  },

  reloadGrid: function() {
    this.$el.masonry('reload');
  },

  closeOpenViews: function(openView) {
    $.each(this.streamViews, _.bind(function(i, view) {
      if (view !== openView) {
        view.closeIfOpen();
      }
    }, this));
  },

  loadUploadView: function(evt) {
    evt.preventDefault();
    this.delegate.loadUploadView();
  }

});
