'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
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
    this.render(options.model);
  },

  render: function(model) {
    model.attributes.selectedRoomId = UserModel.get('selectedRoom');

    this.$el.html(template(model.attributes));

    var formContentEl = '.vFormContent';

    switch (model.attributes.type) {
      case 'text':
        var textPost = new TextPostView({
          el: this.$(formContentEl)
        });
        break;
      case 'picture':
        var picturePost = new PicturePostView({
          el: this.$(formContentEl)
        });
        break;
      case 'video':
      case 'sound':
        var filePost = new FileUploadView({
          el: this.$(formContentEl)
        });
        break;
      case 'color':
        var colorPost = new ColorPostView({
          el: this.$(formContentEl)
        });
        break;
    }

    return this;
  },

  submitForm: function(evt) {
    evt.preventDefault();

    var formData = new FormData($(evt.target).get(0));

    $.ajax({
      url: 'http://insights.dev/api/post/',
      data: formData,
      method: 'POST',
      processData: false,
      contentType: false,
      success: function(data) {
        console.log(data);
      }
    });
  }

});
