'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),
    tinycolor = require('tinycolor'),

    template = require('../../../templates/Upload/Post/Text.hbs');

Backbone.$ = $;

function getColor(val) {

  var color;

  if (val <= 0) {
    color = new tinycolor("black");
  }

  else if (val >= 255) {
    color = new tinycolor("white");
  }

  else {
    color = new tinycolor({
      h: val,
      s: 75,
      v: 100
    });
  }

  return color;
};

module.exports = Backbone.View.extend({

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.append(template());

    this.coloredInputs = this.$('.js-colorInput');

    var sliders = [
      {
        el: this.$('.js-noUiBackground'),
        name: 'background',
        callback: this.setBackgroundColor,
        input: this.$('.js-colorBackgroundVal')
      },
      {
        el: this.$('.js-noUiText'),
        name: 'text',
        callback: this.setTextColor,
        input: this.$('.js-colorTextVal')
      }
    ];

    $.each(sliders, _.bind(function(i, slider) {
      slider.el.noUiSlider({
        start: [-1],
        step: 1,
        range: {
          'min': -1,
          'max': 256
        }
      });

      slider.ref = this.coloredInputs;

      slider.el.on('slide', _.bind(slider.callback, slider));
      slider.el.on('change', _.bind(this.setInputValues, slider));
    }, this));

    return this;
  },

  setBackgroundColor: function() {
    var val = this.el.val();
    var tColor = getColor(val);
    var hex = tColor.toHexString();

    this.ref.css({
      background: hex
    });

    this.color = hex;

    this.input.attr('value', hex);
  },

  setTextColor: function() {
    var val = this.el.val();
    var tColor = getColor(val);
    var hex = tColor.toHexString();

    this.ref.css({
      color: hex
    });

    this.color = hex;

    this.input.attr('value', hex);
  },

  setInputValues: function() {
    this.input.attr('value', this.color);
  }

  /**
   * TODO: unfocus text input fields when slider is dragged ($.blur())
   */

});
