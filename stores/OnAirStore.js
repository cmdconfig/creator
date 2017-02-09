"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let $ = require('jquery');
let OnAirConstants = require('../constants/OnAirConstants');
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
let _constPlaylists = [];
let _lastSearch = '';

/**
 *
 * @param playlistData
 */
function playlistUpdate(playlistData) {
  _playlists.map(function (val, i) {
    if (val.id == playlistData.id) {
      _playlists[i] = playlistData;
      OnAirStore.emitChange();
    }
  });
}

function playlistDelete(playList) {

  _playlists.map(function (val, i) {

    if (val.id == playList.id) {
      _playlists.splice(i, 1);
      edit_playlist(null);
      OnAirStore.emitChange();      
    }
  });
}

let nameSort = '>';
let dateSort = '>';
let sortStatus = '>';
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

    case 'sortDate':
      if (dateSort == '>') {
        playLists = _playlists.sort(function (a, b) {
          return new Date(a.updated) - new Date(b.updated);
        });
        dateSort = '<';
      } else {
        playLists = _playlists.sort(function (a, b) {
          return new Date(b.updated) - new Date(a.updated);
        });
        dateSort = '>';
      }
      break;
    
    case 'sortStatus':
      if (sortStatus == '>') {
        playLists = _playlists.sort(function (a, b) {
          if (a.status > b.status) return 1;
          if (a.status < b.status) return -1;
          return 0;// a должно быть равным b
        });
        sortStatus = '<';
      } else {
        playLists = _playlists.sort(function (a, b) {
          if (a.status < b.status) return 1;
          if (a.status > b.status) return -1;
          return 0;// a должно быть равным b
        });
        sortStatus = '>';
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

  OnAirStore.emitChange();
}

function search(searchText) {
  if (searchText.length == 0) {
    _playlists = _constPlaylists;
    _lastSearch = '';
    OnAirStore.emitChange();
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
  OnAirStore.emitChange();
}

/**
 *
 */
let OnAirStore = assign({}, EventEmitter.prototype, {
  init: function (catalogType) {
    if(_playlists.length > 0) {
      return;
    }
    
    $.ajax({
      url: Routing.generate('v2_api_playlist_on_air'),
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

  getLastSearch: function () {
    return _lastSearch;
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
  }
});

/**
 *
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case OnAirConstants.SORT_ON_AIR:
      sortPlayList(action.sortBy);
      break;

    case PlaylistConstants.UPDATE:
      playlistUpdate(action.playlist);
      break;

    case PlaylistConstants.DELETE:
      playlistDelete(action.id);
      break;

    case OnAirConstants.SEARCH_AON_AIR:
      search(action.searchText);
      break;

    case CatalogConstants.UPDATE_CATALOG:
      if(CatalogStore.getSelectedCatalogType() == 'On Air'){
        OnAirStore.init(catalogType);
      }
      
      break;
  }
});

module.exports = OnAirStore;