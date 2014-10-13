'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    template = require('../../templates/Upload/Upload--Choose.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'click a'  : 'selectUploadType'
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.render();
  },

  render: function() {
    this.$el.append(template(this.collection.toJSON()));
    return this;
  },

  selectUploadType: function(evt) {
    evt.preventDefault();
    var menuId = $(evt.currentTarget).data('menu-id');
    var model = this.collection.get(menuId);

    this.setCurrentMenuClass(menuId);

    this.delegate.selectUploadType(model);
  },

  setCurrentMenuClass: function(id) {
    this.$('a').removeClass('menu-current');


    this.$('*[data-menu-id="' + id + '"]').addClass('menu-current');
  }

});
