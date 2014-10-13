'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    template = require('../../../templates/Upload/Post/Picture.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.append(template());
    return this;
  }

});
