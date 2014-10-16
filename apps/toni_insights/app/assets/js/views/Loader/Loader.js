'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),

    Beacons = require('../../helpers/beacons'),

    template = require('../../templates/Loader/Loader.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  loadingTimeout: 8000,
  beaconPingTime: 500,

  events: {
    'click .js-loaderTryAgain' : 'tryAgain',
    'click .js-searchRoom': 'searchRoom',
    'click .js-startStream': 'startStream'
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.beaconSearchTimer = window.setInterval(_.bind(this.searchBeacons, this), this.beaconPingTime);
    this.loadingTimer = window.setTimeout(_.bind(this.loadPositionFail, this), this.loadingTimeout);
  },

  render: function(loadingStatus, beaconsFound) {

    loadingStatus = 'undefined' === typeof loadingStatus ? true : loadingStatus;
    beaconsFound = 'undefined' === typeof beaconsFound ? false : beaconsFound;

    this.$el.html(template({
      loadingStatus: loadingStatus,
      beaconsFound: beaconsFound
    }));

    this.$('.js-spin').velocity({
      rotateZ: '360deg'
    }, {
      easing: 'linear',
      duration: 2000,
      loop: true
    });

    return this;
  },

  searchBeacons: function() {
    if (Beacons.hasBeacons()) {
      this.loadStreamButton();

      window.clearTimeout(this.loadingTimer);
      window.clearInterval(this.beaconSearchTimer);
    }
  },

  loadStreamButton: function() {
    // implement button here
    // this.render(true, true);

    this.$('.js-spin').velocity('stop', true);
    this.$('.js-spin').velocity({
      rotateZ: '-0deg'
    });
    this.$('.js-spin').addClass('small');

    this.$('.button-spinner').addClass('visible');
  },

  tryAgain: function(evt) {
    evt.preventDefault();

    this.render(true);
  },

  loadPositionFail: function() {
    this.loadStreamButton();

    //this.render(false);
  },

  searchRoom: function(evt) {
    evt.preventDefault();

    this.delegate.loadRoomSelectView();
  },

  startStream: function(evt) {
    evt.preventDefault();

    this.delegate.loadStreamView();
  },

  stop: function() {
    this.$('.js-spin').velocity('stop', true);
  }

});
