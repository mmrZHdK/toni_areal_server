'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    UserModel = require('../../models/UserModel'),
    template = require('../../templates/RoomSelect/RoomSelect--List.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click .js-selectRoom' : 'selectRoom'
  },

  initialize: function() {
    this.collection.on('reset', this.render, this);
  },

  render: function() {
    this.$el.html(template(this.collection.toJSON()));
    return this;
  },

  selectRoom: function(evt) {
    /**
     * empty search results
     */
    this.collection.reset();
    this.collection.trigger('emptyCollection');

    /**
     * choose room and navigate to it
     */
    UserModel.set('selectedRoom', $(evt.target).data('id'));
  }

});
