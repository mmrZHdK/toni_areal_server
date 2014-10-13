'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),

    template = require('../../../templates/Room/Entries/Picture.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  className: 'stream-element stream-element-picture',

  render: function() {

    this.$el.html(template(this.model.attributes));
    return this;
  }

});
