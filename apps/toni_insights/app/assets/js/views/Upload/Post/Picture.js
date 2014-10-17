'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    template = require('../../../templates/Upload/Post/Picture.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  events: {
    'change .js-fileInput': 'handleFile',
    'click .js-fileChange': 'invokeChooseButton'
  },

  initialize: function(options) {
    this.delegate = options.delegate;

    this.render();
  },

  render: function(buttonText) {

    this.$el.html(template());

    return this;
  },

  invokeChooseButton: function() {
    this.$('.js-fileInput').trigger('click');
  },

  /**
   * show image preview
   */
  handleFile: function(evt) {
    var files = evt.target.files;
    var $filePreview = this.$('.js-filePreview');

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var imageType = /image.*/;

      if (!file.type.match(imageType)) {
        continue;
      }

      this.$('.js-buttonText').html('Bild ändern');

      var img = document.createElement('img');
      $(img).addClass('img-responsive js-fileChange');
      img.file = file;

      $filePreview.find('.img-preview-container').html($(img));

      var reader = new FileReader();
      reader.onload = (
        function(aImg) {
          return function(e) {
            aImg.src = e.target.result;
          };
      })(img);

      reader.readAsDataURL(file);
    }
  }

});
