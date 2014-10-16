'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),

    RoomModel = require('../../models/RoomModel'),
    UserModel = require('../../models/UserModel'),

    EntryCollection = require('../../collections/EntryCollection'),

    StreamView = require('./Stream'),

    template = require('../../templates/Room/Room.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function(options) {
    this.delegate = options.delegate;
    this.roomEntryCollection = new EntryCollection();
  },

  render: function() {

    this.$el.html(template(this.model.attributes));

    this.streamView = new StreamView({
      collection: this.roomEntryCollection,
      el: this.$('#vRoomEntries'),
      parentAttributes: this.model.attributes,
      delegate: this.delegate
    });

    return this;
  },

  stop: function() {
    this.streamView.disableStream();
  },

  start: function() {
  }

});
