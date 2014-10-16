'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),

    Beacons = require('../../helpers/beacons'),

    StreamCollection = require('../../collections/StreamCollection'),

    StreamEntriesView = require('./Stream--Entries'),

    template = require('../../templates/Stream/Stream.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function() {
    console.log('render::StreamView');

    /**
     * Beacon interface
     */
    Beacons.startBeaconSearchStream();
    this.updateBeaconsTimer = window.setInterval(_.bind(this.getBeaconData, this), 3000);

    this.streamCollection = new StreamCollection();
  },

  render: function() {
    this.$el.html(template());

    this.streamEntriesView = new StreamEntriesView({
      el: this.$('#vStreamEntries')
    });

    return this;
  },

  getBeaconData: function() {
    //var rooms = Beacons.getRoomNames();

    var rooms = ['4.K20', '4.K21', '4.K22'];


    if (rooms.length > 0) {

      this.loadStreamEntries(rooms);

      var roomObjects = [];

      $.each(rooms, function(i, el) {
        var n = {
          name: el
        };
        roomObjects.push(n);
      });

      this.streamEntriesView.render(rooms);
    }

  },

  loadStreamEntries: function(rooms) {
    this.streamCollection.fetch({reset: false, data: {query: rooms}});
  },

  stop: function() {

  }

  /**
   * TODO: unset updateBeaconsTimer when closing view
   *
   * close function for every view that is called when view is unset
   */

});
