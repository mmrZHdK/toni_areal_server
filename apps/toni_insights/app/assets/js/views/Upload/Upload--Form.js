'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    config = require('../../config'),

    UserModel = require('../../models/UserModel'),
    UploadTypes = require('../../collections/UploadCollection'),
    PicturePostView = require('./Post/Picture'),
    TextPostView = require('./Post/Text'),
    ColorPostView = require('./Post/Color'),
    FileUploadView = require('./Post/File'),

    template = require('../../templates/Upload/Upload--Form.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'submit': 'submitForm',
  },

  initialize: function(options) {
    this.delegate = options.delegate;
    this.render(options.model);
  },

  render: function() {
    this.model.attributes.selectedRoomId = UserModel.get('selectedRoom');

    this.$el.html(template(this.model.attributes));

    var formContentEl = '.vFormContent';

    switch (this.model.attributes.type) {
      case 'text':
        var textPost = new TextPostView({
          el: this.$(formContentEl)
        });
        break;
      case 'picture':
        var picturePost = new PicturePostView({
          el: this.$(formContentEl),
          delegate: {
            uploadFile: _.bind(this.triggerFormSubmit, this)
          }
        });
        break;
      case 'video':
      case 'sound':
        var filePost = new FileUploadView({
          el: this.$(formContentEl)
        });
        break;
    }

    return this;
  },

  triggerFormSubmit: function() {
    this.$('.js-postForm').submit();
  },

  submitForm: function(evt) {
    evt.preventDefault();

    var formData = new FormData($(evt.target).get(0));

    $.ajax({
      url: config.baseUrl + '/api/post/',
      data: formData,
      method: 'POST',
      processData: false,
      contentType: false,
      success: _.bind(function(data) {
        console.log(data);

        /**
         * go back to Room view
         */
        this.delegate.restoreRoomView();
      }, this)
    });
  }

});
