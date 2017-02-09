"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let $ = require('jquery');
let TemplateConstants = require('../constants/TemplateConstants');
let PlaylistConstants = require('../constants/PlaylistConstants');
let CatalogConstants = require('../constants/CatalogConstants');
let CatalogStore = require('./CatalogStore');

/**
 *
 * @type {string}
 */
let CHANGE_EVENT = 'change';

/**
 *
 * @type {Array}
 * @private
 */
let _playlists = [];

/**
 *
 * @type {Array}
 * @private
 */
let _constPlaylists = [];

/**
 *
 * @type {string}
 * @private
 */
let _lastSearch = '';

/**
 *
 * @param playlistData
 */
function playlistUpdate(playlistData) {
  _playlists.map(function (val, i) {
    if (val.id == playlistData.id) {
      _playlists[i] = playlistData;
      TemplateStore.emitChange();
    }
  });
}

/**
 *
 * @type {string}
 */
let nameSort = '>';
let pathSort = '>';
let typeSort = '>';

function sortPlayList(sortBy) {
  let playLists;
  switch (sortBy) {
    case 'sortName':
      if (nameSort == '>') {
        playLists = _playlists.sort(function (a, b) {
          if (a.title > b.title) return 1;
          if (a.title < b.title) return -1;
          return 0;// a должно быть равным b
        });
        nameSort = '<';
      } else {
        playLists = _playlists.sort(function (a, b) {
          if (a.title < b.title) return 1;
          if (a.title > b.title) return -1;
          return 0;// a должно быть равным b
        });
        nameSort = '>';
      }

      break;
    case 'sortPath':
      let preSort =  _playlists.sort(function (a, b) {
        return a.id - b.id;
      });

      _playlists = preSort;

      if (pathSort == '>') {
        playLists = _playlists.sort(function (a, b) {
          if (a.play_list_path > b.play_list_path) return 1;
          if (a.play_list_path < b.play_list_path) return -1;
          return 0;// a должно быть равным b
          // return a.play_list_path >= b.play_list_path;
        });
        pathSort = '<';
      } else {
        playLists = _playlists.sort(function (a, b) {
          if (a.play_list_path < b.play_list_path) return 1;
          if (a.play_list_path > b.play_list_path) return -1;
          return 0;// a должно быть равным b
          // return a.play_list_path <= b.play_list_path;
        });
        pathSort = '>';
      }
      break;

    case 'sortType':
      if (typeSort == '>') {
        playLists = _playlists.sort(function (a, b) {
          return a.pl_type - b.pl_type;
        });
        typeSort = '<';
      } else {
        playLists = _playlists.sort(function (a, b) {
          return b.pl_type - a.pl_type;
        });
        typeSort = '>';
      }
      break;
  }

  _playlists = playLists;

  TemplateStore.emitChange();
}

/**
 *
 */
let TemplateStore = assign({}, EventEmitter.prototype, {
  init: function (catalogType) {
    if(_playlists.length > 0) {
      // return;
    }
    
    $.ajax({
      url: Routing.generate('v2_api_playlist_template'),
      dataType: 'json',
      cache: false,
      data: {catalogType: catalogType},
      success: function (data) {
        _playlists = data;
        _constPlaylists = data;

        if (_lastSearch.length > 0) {
          search(_lastSearch)
        } else {
          this.emit(CHANGE_EVENT);
        }
      }.bind(this),
      error: function (xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
      }
    });
  },

  /**
   *
   * @returns {Array}
   */
  getPlayLists: function () {
    return _playlists;
  },

  /**
   *
   */
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   *
   * @returns {string}
   */
  getLastSearch: function () {
    return _lastSearch;
  }

});

function playlistDelete(playList) {

  _playlists.map(function (val, i) {

    if (typeof playList !== 'undefined' && val.id == playList.id) {
      _playlists.splice(i, 1);
      edit_playlist(null);
      TemplateStore.emitChange();      
    }
  });
}

function search(searchText) {
  if (searchText.length == 0) {
    _playlists = _constPlaylists;
    _lastSearch = '';
    TemplateStore.emitChange();
    return;
  }
  _lastSearch = searchText;

  let tmpPlayList = [];
  tmpPlayList = _constPlaylists.map(function (pl) {
    if (pl.title.toLowerCase().includes(searchText.toLowerCase())) {
      return pl;
    }
    return false;
  });

  _playlists = tmpPlayList;
  TemplateStore.emitChange();
}

/**
 *
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case TemplateConstants.SORT_TEMPLATE:
      sortPlayList(action.sortBy);
      break;

    case PlaylistConstants.UPDATE:
      playlistUpdate(action.playlist);
      break;

    case PlaylistConstants.DELETE:
      playlistDelete(action.id);
      
      break;

    case TemplateConstants.SEARCH_TEMPLATE:
      search(action.searchText);
      break;

    case CatalogConstants.UPDATE_CATALOG:
      if(CatalogStore.getSelectedCatalogType() == 'Templates') {
        TemplateStore.init(catalogType);
      }     
      break;
  }
});

module.exports = TemplateStore;