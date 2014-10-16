'use strict';

var Backbone = require('backbone'),
    $ = require('jquery'),
    _ = require('underscore'),

    UserModel = require('../../models/UserModel'),
    HeaderButton = require('./Button'),
    HeaderTitleView = require('./Title'),

    template = require('../../templates/Header/Header.hbs');

Backbone.$ = $;

module.exports = Backbone.View.extend({

  currentButtonLeft: null,
  currentButtonRight: null,

  initialize: function(options) {

    this.delegate = options.delegate;

    this.buttonUpload = new HeaderButton({
      iconName: 'plus',
      id: 'button-upload',
      className: '',
      buttonAction: _.bind(this.buttonUploadAction, this)
    });

    this.buttonRoomSelect = new HeaderButton({
      iconName: 'search',
      id: 'button-roomselect',
      className: '',
      buttonAction: _.bind(this.buttonRoomSelectAction, this)
    });

    this.buttonStream = new HeaderButton({
      iconName: 'eye',
      id: 'button-stream',
      className: '',
      buttonAction: _.bind(this.buttonStreamAction, this)
    });

    this.buttonBackRight = new HeaderButton({
      iconName: 'arrow-right',
      id: 'button-back-right',
      className: '',
      buttonAction: _.bind(this.buttonBackRightAction, this)
    });

    /**
     * Define button action properties
     */
    this.actions = {
      'vLoader': {
        left: null,
        right: null,
        transition: _.bind(this.transitionToLoader, this),
        name: 'Insights'
      },
      'vStream': {
        left: null,
        right: this.buttonRoomSelect,
        transition: _.bind(this.transitionToStream, this),
        name: 'Stream'
      },
      'vRoomSelect': {
        left: this.buttonStream,
        right: null, //this.buttonBackRight,
        transition: _.bind(this.transitionToRoomSelect, this),
        name: 'Raumauswahl'
      },
      'vRoom': {
        left: this.buttonRoomSelect,
        right: this.buttonUpload,
        transition: _.bind(this.transitionToRoom, this),
        name: 'Raum'
      },
      'vUpload': {
        left: null, //this.buttonRoomSelect,
        right: this.buttonUpload,
        transition: _.bind(this.transitionToUpload, this),
        name: 'Eintrag hinzuf&uuml;gen'
      },
      'vUploadForm': {
        left: null,
        right: this.buttonUpload,
        transition: _.bind(this.transitionToUploadForm, this),
        name:  'Eintrag hinzuf&uuml;gen'
      }
    };

    this.render();
  },

  render: function() {
    this.$el.html(template(UserModel.attributes));

    this.headerTitle = new HeaderTitleView({
      el: this.$('#vHeaderTitle')
    });

    return this;
  },

  prepare: function(newViewName) {
    /**
     * TODO: improve this little mess ;)
     * maybe optimize how buttons are handled
     */

    var selectedRoom = UserModel.get('selectedRoom'),
        selectedRoomName = UserModel.get('selectedRoomName'),
        leftButton = this.actions[newViewName].left,
        rightButton = this.actions[newViewName].right,
        name = this.actions[newViewName].name;


    if (null !== leftButton) {
      leftButton.$el.addClass('header-left');
      /**
       * TODO: add UI animation
       */
      this.$el.append(leftButton.render().el);
      leftButton.delegateEvents();
    }

    if (null !== this.currentButtonLeft && this.currentButtonLeft !== leftButton || null === leftButton) {
      this.removeButton(this.currentButtonLeft);
    }

    /**
     * exclude showing the right button when:
     * - type of button is button-right-back
     * - selectedRoom is not set
     */
    if (null !== rightButton || (null !== rightButton && rightButton.el.id === 'button-back-right' && 'undefined' !== typeof selectedRoom)) {
      rightButton.$el.addClass('header-right');
      /**
       * TODO: add UI animation
       */
      this.$el.append(rightButton.render().el);
      rightButton.delegateEvents();
    }

    if (null !== this.currentButtonRight && this.currentButtonRight !== rightButton || null === rightButton) {
      this.removeButton(this.currentButtonRight);
    }


    if ('vRoom' === newViewName) {
      this.buttonUpload.setState('add');
      name = selectedRoomName;
    }
    else if ('vUpload' === newViewName || 'vUploadForm' === newViewName) {
      this.buttonUpload.setState('close');
    }

    if ('vRoom' !== newViewName) {

    }

    this.headerTitle.setName(name);


    this.currentButtonLeft = leftButton;
    this.currentButtonRight = rightButton;
  },

  update: function(newViewName, lastViewName) {
    console.log('Header::update::from ' + lastViewName + ' to ' + newViewName);

    if ('self' !== lastViewName) {
      this.actions[newViewName].transition(lastViewName);
    }

    if ('vLoader' == newViewName) {
      this.hideHeader();
    }
    else {
      if (this.$el.hasClass('hidden')) {
        this.$el.removeClass('hidden');
      }
      this.prepare(newViewName);
    }
  },

  hideHeader: function() {
    this.$el.addClass('hidden');
  },

  removeButton: function(obj) {
    /**
     * TODO: Add UI animation here
     */
    if (null !== obj) {
      obj.$el.remove();
    }
  },

  transitionToLoader: function(lastViewName) {

  },

  transitionToUpload: function(lastViewName) {
    this.buttonUpload.$el.velocity({
      rotateZ: '45deg'
    });
  },

  transitionToUploadForm: function(lastViewName) {

  },

  transitionToRoom: function(lastViewName) {
    if ('vUpload' === lastViewName || 'vUploadForm' === lastViewName) {
      this.buttonUpload.$el.velocity('reverse');
    }
  },

  transitionToRoomSelect: function(lastViewName) {

  },

  transitionToStream: function(lastViewName) {
    console.log('Header::transitionToStream');
  },

  buttonUploadAction: function(evt) {
    evt.preventDefault();

    if ('add' === this.buttonUpload.getState()) {
      this.delegate.loadUploadView();
    }
    else if ('close' === this.buttonUpload.getState()) {
      this.delegate.restoreRoomView();
    }
  },

  buttonRoomSelectAction: function(evt) {
    evt.preventDefault();

    this.delegate.loadRoomSelectView();
  },

  buttonStreamAction: function(evt) {
    evt.preventDefault();

    this.delegate.loadLoaderView();
  },

  buttonBackRightAction: function(evt) {
    this.delegate.loadPreviousView();
  }

});
