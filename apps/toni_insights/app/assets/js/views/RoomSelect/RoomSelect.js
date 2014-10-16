'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    velocity = require('velocity'),

    RoomSearchView = require('./RoomSelect--Search'),

    template = require('../../templates/RoomSelect/RoomSelect.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click input': 'clickInput'
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
      el: this.$('#vRoomSearch'),
      delegate: this.delegate
    });

    return this;
  },

  requestLoaderView: function(evt) {
    evt.preventDefault();
    this.delegate.requestLoaderView();
  },

  clickInput: function(evt) {
    this.moveForm();
  },

  moveForm: function() {
    if (! $('.content').hasClass('is-moved')) {
      var offsetY = $('.js-scrollTo').offset().top;
      var headerHeight = $('.header').height();
      var offset = 10;


      $('.content').velocity({
        top: -offsetY + offset + headerHeight + 'px'
      }, {
        complete: function() {
          $(this).addClass('is-moved');
        }
      });
    }
  },

  stop: function() {

  }

});
