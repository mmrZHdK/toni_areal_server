'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    RoomSearchView = require('./RoomSelect--Search'),
    template = require('../../templates/RoomSelect/RoomSelect.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click .js-loaderTryAgain' : 'requestLoaderView'
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.comingFromLoader = 'undefined' !== typeof options.comingFromLoader ? options.comingFromLoader : false;
  },

  render: function() {
    this.$el.html(template({
      comingFromLoader: this.comingFromLoader
    }));

    var roomSearchView = new RoomSearchView({
      el: this.$('#vRoomSearch')
    });

    return this;
  },

  requestLoaderView: function(evt) {
    evt.preventDefault();

    this.delegate.requestLoaderView();
  }

});
