'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    config = require('../../config'),
    Beacons = require('../../helpers/beacons'),

    template = require('../../templates/Loader/Loader.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  loadingTimeout: 5000,
  beaconPingTime: 500,

  events: {
    'click .js-loaderTryAgain' : 'tryAgain',
    'click .js-searchRoom': 'searchRoom',
    'click .js-startStream': 'startStream'
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.initTimers();
  },

  render: function(loadingStatus, beaconsFound) {

    loadingStatus = 'undefined' === typeof loadingStatus ? true : loadingStatus;
    beaconsFound = 'undefined' === typeof beaconsFound ? false : beaconsFound;

    this.$el.html(template({
      loadingStatus: loadingStatus,
      beaconsFound: beaconsFound,
      iOSDevice: this.isiOSDevice()
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

  isiOSDevice: function() {
    if (config.environment === 'dev' || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
        return true;
    }
    return false;
  },

  initTimers: function() {
    this.beaconSearchTimer = window.setInterval(_.bind(this.searchBeacons, this), this.beaconPingTime);
    this.loadingTimer = window.setTimeout(_.bind(this.loadPositionFail, this), this.loadingTimeout);
  },

  stopTimers: function() {
    window.clearTimeout(this.loadingTimer);
    window.clearInterval(this.beaconSearchTimer);
  },

  searchBeacons: function() {
    if (Beacons.hasBeacons()) {
      //this.loadStreamButton();

      this.stopTimers();
      this.stopSpinner();
      this.render(true, true);
    }
  },

  loadStreamButton: function() {
    // implement button here
    // this.render(true, true);

    this.$('.js-spin').velocity({
      rotateZ: '-0deg'
    });
    this.$('.js-spin').addClass('small');

    this.$('.button-spinner').addClass('visible');
  },

  tryAgain: function(evt) {
    evt.preventDefault();

    this.initTimers();
    this.render(true, false);
  },

  loadPositionFail: function() {
    //this.loadStreamButton();

    this.stopTimers();
    this.stopSpinner();
    this.render(false, false);

  },

  searchRoom: function(evt) {
    evt.preventDefault();

    this.delegate.loadRoomSelectView();
  },

  startStream: function(evt) {
    evt.preventDefault();

    this.delegate.loadStreamView();
  },

  stopSpinner: function() {
    this.$('.js-spin').velocity('stop', true);
  },

  stop: function() {
    this.stopSpinner();
    this.stopTimers();
  }

});
