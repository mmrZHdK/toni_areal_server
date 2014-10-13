'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    config = require('../../config'),
    UploadModel = require('../../models/UploadModel'),
    UploadCollection = require('../../collections/UploadCollection'),
    ChooseUploadView = require('./Upload--Choose'),
    UploadFormView = require('./Upload--Form'),

    template = require('../../templates/Upload/Upload.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  className: 'upload',

  initialize: function() {
    this.uploadList = new UploadCollection(config.uploadTypes);
    this.render();
  },

  render: function() {

    this.$el.html(template());

    var chooseUploadView = new ChooseUploadView({
      collection: this.uploadList,
      el: this.$('.vChooseUpload'),
      delegate: {
        selectUploadType: _.bind(this.selectUploadType, this)
      }
    });

    // select first menu item
    chooseUploadView.setCurrentMenuClass(1);

    // select the first model as a standard
    var selectedFormModel = this.uploadList.get(1);

    this.uploadFormView = new UploadFormView({
      model: selectedFormModel,
      el: this.$('.vUploadForm')
    });

    return this;
  },

  selectUploadType: function(model) {
    // load in new Upload view
    this.uploadFormView.render(model);
  }

});
