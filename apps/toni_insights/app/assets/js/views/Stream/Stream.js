'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    config = require('../../config'),

    Beacons = require('../../helpers/beacons'),

    StreamCollection = require('../../collections/StreamCollection'),

    MainStreamView = require('./MainStream'),

    template = require('../../templates/Stream/Stream.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  lastBeacon: {},

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

    this.mainStreamView = new MainStreamView({
      el: this.$('#vStreamEntries'),
      collection: this.streamCollection
    });

    return this;
  },

  getBeaconData: function() {
    var rooms = Beacons.getRoomNames(),
        newBeacon = Beacons.getLastBeacon(),
        newBeaconString = newBeacon.major + '.' + newBeacon.minor,
        lastBeaconString = this.lastBeacon.major + '.' + this.lastBeacon.minor;

    console.log('Old Beacon: ' + lastBeaconString + '  ||  New Beacon: ' + newBeaconString);

    /**
     * debug
     */
    if (config.environment === 'dev') {
      var rooms = ['4.K20', '4.K21', '4.K22'];
      this.loadStreamEntries(rooms);
      return;
    }

    if (lastBeaconString !== newBeaconString || 'undefined' === typeof this.lastBeacon) {

      console.log('>> I have a New Beacon, reset collection');

      if (rooms.length > 0) {

        console.log('Rooms: ' + rooms.join());

        /**
         * fetch new data for collection
         */
        this.loadStreamEntries(rooms);
      }
      else {
        console.log('No Rooms for this beacon');
      }
      this.lastBeacon = newBeacon;
    }
  },

  loadStreamEntries: function(rooms) {
    this.streamCollection.fetch({
      data: {query: rooms},
      reset: true
    });
  },

  stop: function() {
    window.clearInterval(this.updateBeaconsTimer);
    this.mainStreamView.disableStream();
  }

});
