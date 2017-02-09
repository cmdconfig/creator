"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let moment = require('moment');
let $ = require('jquery');
let EditingConstants = require('../constants/EditingConstants');
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
let _lastSort = '';

let nameSort = '>';
let dateSort = '>';
let typeSort = '>';
let statusSort = '>';

/**
 *
 */
let EditStore = assign({}, EventEmitter.prototype, {
  /**
   *
   * @param catalogType
   */
  init: function (catalogType) {
    if(_playlists.length > 0) {
      return;
    }

    $.ajax({
      url: Routing.generate('v2_api_playlist_in_editing'),
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

        if (_lastSort.length > 0) {
          sortPlayList(_lastSort);
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
 * @param playlistData
 */
function playlistUpdate(playlistData) {
  _playlists.map(function (val, i) {
    if (val.id == playlistData.id) {
      _playlists[i] = playlistData;
      EditStore.emitChange();
    }
  });
}

/**
 *
 * @param playListId
 * @param success
 */
function createTemplate(playListId, success) {
  let data = {
    playListId: playListId
  };

  $.ajax({
    type: 'post',
    url: Routing.generate('v2_api_create_template_from_play_list'),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      // console.error( status, err.toString());
    }
  });
}

/**
 *
 * @param playListId
 * @param repeat
 * @param success
 */
function savePlayList(playListId, repeat, success) {
  let data = {
    playListId: playListId,
    repeat: {
      id: repeat.id,
      date_start: moment(repeat.date_start).format('YYYY-MM-DD HH:mm'),
      date_end: moment(repeat.date_end).format('YYYY-MM-DD HH:mm')
    }
  };

  $.ajax({
    type: 'get',
    url: Routing.generate('v2_api_save_edited_play_list'),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      console.error('savePlayList', err.toString());
    }
  });
}

/**
 *
 * @param playList
 */
function updatePlayList(playList) {
  _playlists.map(function (pl, i) {
    if (pl.id == playList.id) {
      _playlists[i] = playList;
      // EditStore.emitChange();
    }
  });
}

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
    

      if (statusSort == '>') {
        playLists = _playlists.sort(function (a, b) {
          return a.catalog_type - b.catalog_type;
        });
        statusSort = '<';
      } else {
        playLists = _playlists.sort(function (a, b) {
          return b.catalog_type - a.catalog_type;
        });
        statusSort = '>';
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

  EditStore.emitChange();
}

function playlistDelete(playList) {

  _playlists.map(function (val, i) {

    if (val.id == playList.id) {
      _playlists.splice(i, 1);
      edit_playlist(null);
      EditStore.emitChange();      
    }
  });
}

function search(searchText) {
  let tmpPlayList = [];

  if (searchText.length == 0) {
    _playlists = _constPlaylists;
    _lastSearch = '';
    EditStore.emitChange();
    return;
  }

  _lastSearch = searchText;

  tmpPlayList = _constPlaylists.map(function (pl) {
    if (pl.title.toLowerCase().includes(searchText.toLowerCase())) {
      return pl;
    }
    return false;
  });

  _playlists = tmpPlayList;
  EditStore.emitChange();
}
/**
 *
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case EditingConstants.CREATE_TEMPLATE:
      createTemplate(action.playListId, function (data) {
        if(CatalogStore.getSelectedCatalogType() == 'Editing') {
          EditStore.init(catalogType);
        }
        AppDispatcher.dispatch({
          actionType: CatalogConstants.UPDATE_CATALOG         
        })
      });
      break;
    case EditingConstants.SAVE_TEMPLATE:
      savePlayList(action.playList, function (data) {
        updatePlayList(data);
      });
      break;
    case EditingConstants.SAVE_CHANGED_PLAY_LIST:
      savePlayList(action.playListId, action.repeat, function (data) {
        updatePlayList(data);
        EditStore.emitChange();
      });
      break;
    case EditingConstants.SORT_EDITING:
      sortPlayList(action.sortBy);
      break;

    case PlaylistConstants.UPDATE:
      playlistUpdate(action.playlist);
      break;

    case PlaylistConstants.DELETE:
      playlistDelete(action.id);
      break;

    case EditingConstants.SEARCH_EDITING:
      search(action.searchText);
      break;
  }
});

module.exports = EditStore;