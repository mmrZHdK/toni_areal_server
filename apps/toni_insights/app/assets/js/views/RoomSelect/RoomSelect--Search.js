'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    UserModel = require('../../models/UserModel'),
    RoomListCollection = require('../../collections/RoomListCollection'),
    RoomListView = require('./RoomSelect--List'),
    template = require('../../templates/RoomSelect/RoomSelect--Search.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'keyup .js-searchEbene': 'searchEbene',
    'keyup .js-searchGang': 'searchGang',
    'keyup .js-searchRaum': 'searchRaum',
    'focus input': 'removeFailureNotification'
  },

  initialize: function() {
    this.roomListCollection = new RoomListCollection();
    this.listenTo(this.roomListCollection, 'emptyCollection', this.clearSearchInput);

    this.roomList = new RoomListView({
      collection: this.roomListCollection,
      id: 'vRoomList',
      className: 'col-xs-12'
    });

    this.render();
  },

  render: function() {
    this.$el.html(template());

    /**
     * append rendered roomList after RoomSearch
     */
    this.$el.after(this.roomList.render().el);

    return this;
  },

  search: function() {
    var keyEbene = UserModel.get('searchValEbene');
    var keyGang = UserModel.get('searchValGang');
    var keyRaum = UserModel.get('searchValRaum');

    var key = keyEbene + '.' + keyGang + keyRaum;

    this.roomListCollection.fetch({reset: true, data: {query: key}});
  },

  /**
   * move to next input field upon keyup
   */
  searchEbene: function(evt) {
    var key = $(evt.target).val();
    UserModel.set('searchValEbene', key);

    this.search();

    this.$('.js-searchGang').focus();
  },

  /**
   * move to next input field upon keyup
   */
  searchGang: function(evt) {
    var key = $(evt.target).val();
    UserModel.set('searchValGang', key);

    this.search();

    this.$('.js-searchRaum').focus();
  },

  searchRaum: function(evt) {
    var key = $(evt.target).val();
    UserModel.set('searchValRaum', key);

    this.search();
    // TODO: DECIDE: autoload RoomView when input is 2 keys
  },

  /**
   * empty search field when room is selected
   */
  clearSearchInput: function() {
    this.$('input').val('');
    UserModel.set('searchVal', '');
  },

  removeFailureNotification: function() {

  }

});
