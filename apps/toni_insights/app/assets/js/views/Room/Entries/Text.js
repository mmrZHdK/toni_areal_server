'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),

    template = require('../../../templates/Room/Entries/Text.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  className: 'stream-element stream-element-text',

  render: function() {
    this.$el.css({
      color: this.model.attributes.textColor,
      background: this.model.attributes.textBackground
    });
    this.$el.html(template(this.model.attributes));
    return this;
  }

});
