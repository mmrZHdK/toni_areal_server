'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),

    UserModel = require('./models/UserModel'),

    LoaderView = require('./views/Loader/Loader'),
    RoomView = require('./views/Room/Room'),
    AppView = require('./views/App');

Backbone.$ = $;

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home',
    'room/:id': 'room',
    'room/:id/upload': 'upload',
    'search': 'search'
  },

  loadAppView: function() {
    this.appView = new AppView({
      delegate: {
        navigate: _.bind(this.navigate, this)
      }
    });
  },

  home: function() {
    this.loadAppView();

    this.appView.loadLoaderView();
  },

  room: function(id) {
    this.loadAppView();
    this.appView.prepareRoomView(id);
  },

  upload: function(id) {
    this.loadAppView();
    this.appView.loadUploadView(id);
  },

  search: function() {
    this.loadAppView();
    this.appView.loadRoomSelectView();
  }

});
