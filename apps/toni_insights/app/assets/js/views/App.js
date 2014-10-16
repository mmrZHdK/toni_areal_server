'use strict';

var $ = require('jquery'),
    _ = require('underscore'),
    velocity = require('velocity'),
    Backbone = require('backbone'),

    // Models
    RoomModel = require('../models/RoomModel'),
    UserModel = require('../models/UserModel'),

    // Collections
    RoomCollection = require('../collections/RoomCollection'),

    // Views
    HeaderView = require('./Header/Header'),
    LoaderView = require('./Loader/Loader'),
    StreamView = require('./Stream/Stream'),
    //MainView = require('./Main'),
    ContentView = require('./Content'),
    RoomSelectView = require('./RoomSelect/RoomSelect'),
    UploadView = require('./Upload/Upload'),
    UploadFormView = require('./Upload/Upload--Form'),
    RoomView = require('./Room/Room'),

    // Template
    template = require('../templates/App.hbs');

Backbone.$ = $;

require('velocity-animate');

module.exports = Backbone.View.extend({

  el: $('#app-container'),
  lastViewObj: null,

  /**
   * Animation directions
   */
  transitions: {
    'vLoader': {
      'vStream': 'left',
      'vRoomSelect': 'left'
    },
    'vStream': {
      'vRoomSelect': 'left'
    },
    'vRoomSelect': {
      'vLoader': 'right',
      'vStream': 'right',
      'vRoom': 'left'
    },
    'vRoom': {
      'vUpload': {
        direction: 'left',
        unLoadView: false
      },
      'vRoomSelect': 'right'
    },
    'vUpload': {
      'vRoomSelect': 'right',
      'vRoom': 'right',
      'vUploadForm': 'left'
    },
    'vUploadForm': {
      'vRoom': 'right'
    }
  },

  initialize: function() {
    this.listenTo(UserModel, 'change:selectedRoom', this.selectRoom);
    this.render();
  },

  render: function() {
    this.$el.html(template());

    this.loadHeaderView();
    this.loadContentView();

    return this;
  },

  /******************************
   *
   *  The Header
   *
   ******************************/
  loadHeaderView: function() {
    this.headerView = new HeaderView({
      el: this.$('#vHeader'),
      delegate: {
        getCurrentView: function() {
          return this.currentView;
        },
        loadLoaderView: _.bind(this.loadLoaderView, this),
        loadStreamView: _.bind(this.loadStreamView, this),
        loadRoomSelectView: _.bind(this.loadRoomSelectView, this),
        loadRoomView: _.bind(this.loadRoomView, this),
        restoreRoomView: _.bind(this.restoreRoomView, this),
        loadUploadView: _.bind(this.loadUploadView, this),
        loadPreviousView: _.bind(this.loadPreviousView, this)
      }
    });
  },

  updateHeader: function(newViewName) {
    var lastViewName = null !== this.lastViewObj ? this.lastViewObj.el.id : 'self';
    this.headerView.update(newViewName, lastViewName);
  },

  /******************************
   *
   *  Main Content
   *
   ******************************/

  /**
   * Content
   */
  loadContentView: function() {
    this.contentView = new ContentView({
      el: this.$('#vContent'),
    });
  },

  /**
   * View Loader
   */
  loadView: function(newViewName, newViewObj) {

    if (this.lastViewObj === null) {
      this.contentView.$el.append(newViewObj.render().el);
    }

    else {
      var unLoadView = true;
      var direction = 'none';
      var lastView = this.lastViewObj.el.id || 'none';


      if (lastView !== 'none') {
        if (this.transitions[lastView][newViewName] instanceof Object) {
          direction = this.transitions[lastView][newViewName].direction || 'none';
          unLoadView = this.transitions[lastView][newViewName].unLoadView || true;
        }
        else {
          direction = this.transitions[lastView][newViewName] || 'none';
        }

      }

      if (direction !== 'none') {

        var viewAlreadyInserted = false;

        if (!(this.transitions[newViewName][lastView] instanceof Object) || !this.transitions[newViewName][lastView].unLoadView) {
          viewAlreadyInserted = true;
          this.contentView.$el.append(newViewObj.render().el);
        }

        /**
         * animate
         */
        this.slideOutView(this.lastViewObj, direction, unLoadView);
        this.slideInView(newViewObj.$el, direction, viewAlreadyInserted, newViewObj);
      }

      else {
        this.contentView.$el.append(newViewObj.render().el);
      }
    }

    this.updateHeader(newViewName);

    this.lastViewObj = newViewObj;
  },

  slideOutView: function(viewObj, direction, unLoadView) {
    var $view = viewObj.$el;

    $view.removeAttr('style');

    var animationOptions = {
      'left': { 'left': -$view.width() },
      'right': { 'right': -$view.width() }
    };

    $view.velocity(
      animationOptions[direction],
      {
        duration: 450,
        easing: 'easeInOut',
        complete: _.bind(function() {
          this.stopView(viewObj);
          if (unLoadView) {
            this.unsetView(viewObj);
          }
        }, this)
      }
    );
  },

  slideInView: function($view, direction, viewAlreadyInserted, newViewObj) {

    /**
     * check if view is already applied
     */
    var animationOptions = {
        'left': { 'left': 0 },
        'right' : { 'right': 0 }
      },
      cssOptions = {
        'left': { 'left': $view.width() },
        'right': { 'right': $view.width() }
      };

    /**
     * make sure all css is reset before applied,
     * as the view might still be there
     */
    if (viewAlreadyInserted) {
      $view.removeAttr('style');
    }

    $view.css(cssOptions[direction]);

    $view.velocity(
      animationOptions[direction],
      {
        duration: 450,
        easing: 'easeInOutQuart',
        complete: _.bind(function() {
          // animation complete
          this.startView(newViewObj);
        }, this)
      }
    );
  },

  startView: function(viewObj) {
    if ('undefined' !== typeof viewObj.start) {
      viewObj.start();
    }
  },

  stopView: function(viewObj) {
    if ('undefined' !== typeof viewObj.stop) {
      viewObj.stop();
    }
  },

  unsetView: function(viewObj) {
    viewObj.$el.remove();
    viewObj.off();
    viewObj = null;
  },

  /******************************
   *
   *  The Views
   *
   ******************************/

  /**
   * Loader
   */
  loadLoaderView: function() {
    var id = 'vLoader';

    this.loaderView = new LoaderView({
      id: id,
      className: 'content-view',
      delegate: {
        loadRoomSelectView: _.bind(this.loadRoomSelectView, this),
        loadStreamView: _.bind(this.loadStreamView, this)
      }
    });

    this.loadView(id, this.loaderView);
  },

  /**
   * Stream
   */
  loadStreamView: function() {
    var id = 'vStream';

    this.streamView = new StreamView({
      id: id,
      className: 'content-view',
      delegate: {

      }
    });

    this.loadView(id, this.streamView);
  },

  /**
   * RoomSelect
   */
  loadRoomSelectView: function(comingFromLoader) {
    var id = 'vRoomSelect';

    this.roomSelectView = new RoomSelectView({
      id: id,
      className: 'content-view',
      comingFromLoader: comingFromLoader,
      delegate: {
        requestLoaderView: _.bind(this.loadLoaderView, this),
        loadRoomView: _.bind(this.prepareRoomView, this)
      }
    });

    this.loadView(id, this.roomSelectView);
  },

  /**
   * Room
   */
  prepareRoomView: function(roomId) {

    UserModel.set('selectedRoom', roomId);

    var room = new RoomModel({id: roomId});

    /**
     * instantiate a Room Collection and immediately add the created room instance
     */
    var roomCollection = new RoomCollection(room);

    room.fetch({
      success: _.bind(this.loadRoomView, this)
    });
  },

  loadRoomView: function(model) {
    var id = 'vRoom';

    UserModel.set('selectedRoomName', model.attributes.roomNrHumanShort);

    this.roomView = new RoomView({
      id: id,
      className: 'content-view',
      model: model,
      delegate: {
        loadUploadView: _.bind(this.loadUploadView, this)
      }
    });

    this.loadView(id, this.roomView);
  },

  restoreRoomView: function() {
    var id = 'vRoom';
    this.loadView(id, this.roomView);
  },

  /**
   * Upload
   */
  loadUploadView: function(roomId) {
    var id = 'vUpload';

    if ('undefined' !== typeof roomId) {
      /**
       * TODO: check if room number exists
       */
      UserModel.set('selectedRoom', roomId);
    }

    this.uploadView = new UploadView({
      id: id,
      className: 'content-view',
      delegate: {
        restoreRoomView: _.bind(this.restoreRoomView, this),
        loadUploadFormView: _.bind(this.loadUploadFormView, this)
      }
    });

    this.loadView(id, this.uploadView);
  },

  loadUploadFormView: function(model) {
    var id = 'vUploadForm';

    this.uploadFormView = new UploadFormView({
      id: id,
      className: 'content-view upload-form-container',
      model: model,
      delegate: {
        restoreRoomView: _.bind(this.restoreRoomView, this)
      }
    });

    this.loadView(id, this.uploadFormView);
  },

  loadPreviousView: function() {
    console.log('TODO: implement previous view');
  },

  /*loadMainView: function(view, attributes) {
    this.mainView.render(view, attributes);
  },*/

  selectRoom: function() {

  }

});
