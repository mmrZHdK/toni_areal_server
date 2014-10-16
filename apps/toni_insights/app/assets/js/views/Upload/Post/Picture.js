'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    template = require('../../../templates/Upload/Post/Picture.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'change .js-fileInput': 'uploadFile'
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.render();
  },

  render: function() {
    this.$el.append(template());
    return this;
  },

  uploadFile: function() {
    this.delegate.uploadFile();
  }

});
