'use strict';

var Backbone = require('backbone'),
    $ = require('jquery');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function() {

  },

  render: function(name) {
    this.$el.html(name);
    return this;
  },

  setName: function(name) {
    this.render(name);
  }

});
