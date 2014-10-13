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

  initialize: function() {
    this.roomEntryCollection = new EntryCollection();
  },

  render: function() {
    this.$el.html(template(this.model.attributes));

    var streamView = new StreamView({
      collection: this.roomEntryCollection,
      el: this.$('#vRoomEntries'),
      parameter: {
        id: this.model.attributes.id
      }
    });

    return this;
  }

});
