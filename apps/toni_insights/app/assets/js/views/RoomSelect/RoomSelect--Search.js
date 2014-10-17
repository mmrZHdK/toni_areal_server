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
    'keypress .js-searchRaum': 'onEnter',
    'click input': 'clickInput'
  },

  initialize: function(options) {
    this.delegate = options.delegate;
    this.roomListCollection = new RoomListCollection();
    //this.listenTo(this.roomListCollection, 'emptyCollection', this.clearSearchInput);

    this.roomList = new RoomListView({
      collection: this.roomListCollection,
      id: 'vRoomList',
      className: 'col-xs-12',
      delegate: options.delegate
    });

    this.render();

    if ('' !== UserModel.attributes.selectedRoom && '' !== UserModel.attributes.searchValEbene) {
      this.search();
    }
  },

  render: function() {
    this.$el.html(template(UserModel.toJSON()));

    /**
     * append rendered roomList after RoomSearch
     */
    this.$el.after(this.roomList.render().el);

    return this;
  },

  search: function() {
    var searchValue = this.getSearchValue();

    this.roomListCollection.fetch({reset: true, data: {query: searchValue}});

    return searchValue;
  },

  getSearchValue: function() {
    var keyEbene = UserModel.get('searchValEbene');
    var keyGang = UserModel.get('searchValGang');
    var keyRaum = UserModel.get('searchValRaum');

    return keyEbene + '.' + keyGang + keyRaum;
  },

  /**
   * move to next input field upon keyup
   */
  searchEbene: function(evt) {
    var key = $(evt.currentTarget).val();

    this.readValues();
    this.search();

    if (this.matchKey(key)) {
      this.$('.js-searchGang').focus();
    }
  },

  /**
   * move to next input field upon keyup
   */
  searchGang: function(evt) {
    var key = $(evt.currentTarget).val();

    this.readValues();
    this.search();

    if (this.matchKey(key)) {
      this.$('.js-searchRaum').focus();
    }
  },

  searchRaum: function(evt) {
    var key = $(evt.currentTarget).val();

    this.readValues();

    if (this.matchKey(key)) {
      this.search();
    }
    // TODO: DECIDE: autoload RoomView when input is 2 keys
  },

  readValues: function() {
    var valEbene = $('.js-searchEbene').val();
    var valGang = $('.js-searchGang').val().toUpperCase();
    var valRaum = $('.js-searchRaum').val().toUpperCase();

    UserModel.set('searchValEbene', valEbene);
    UserModel.set('searchValGang', valGang);
    UserModel.set('searchValRaum', valRaum);
  },

  matchKey: function(key) {
    return key.match(/(\d+|\w+)/);
  },

  submitSearch: function() {

    var searchValue = this.search();
    var roomModel = this.roomListCollection.findWhere({roomNrHumanShort: searchValue});

    Backbone.history.navigate('room/' + roomModel.attributes.id, false);
    this.delegate.loadRoomView(roomModel.attributes.id);
  },

  onEnter: function(evt) {
    if (evt.keyCode == 10 || evt.keyCode == 13) {
      evt.preventDefault();

      this.submitSearch();
    }
  },

  clickInput: function(evt) {
    $(evt.currentTarget).select();
  },

  /**
   * empty search field when room is selected
   */
  clearSearchInput: function() {
    this.$('input').val('');
    UserModel.set('searchVal', '');
  }

});
