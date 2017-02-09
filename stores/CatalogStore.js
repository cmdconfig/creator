"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let CatalogConstants = require('../constants/CatalogConstants');
let TreeActions = require('../actions/TreeActions');

/**
 * @type {string}
 */
let CHANGE_EVENT = 'change';

/**
 * @type {null}
 * @private
 */
let _selectedPlayList = undefined;

/**
 *
 * @type {boolean}
 * @private
 */
let _openAddPlayList = false;

let _selectedCatalogType = 'Tree';


let localStorageCatalog;

let _selectedFoldersIdArr = [];

let lsCatalogType = 'Catalog_' + catalogType;

if(typeof localStorage[lsCatalogType] !== 'undefined') {
  localStorageCatalog = JSON.parse(localStorage[lsCatalogType]);
  if(typeof localStorageCatalog.selectedFoldersIdArr !== 'undefined'){
    _selectedFoldersIdArr = localStorageCatalog.selectedFoldersIdArr;
  }
}
/**
 *
 * @type {Array}
 * @private
 */
let _playListTypes = [];

/**
 *
 * @type {Array}
 * @private
 */
let _playListCatalogTypes = [];

/**
 *
 */
let _catalogType = catalogType;

/**
 *
 * @param playListCatalogTypes
 */
function initPlayListCatalogTypes(playListCatalogTypes) {
  _playListCatalogTypes = playListCatalogTypes;
}

/**
 *
 * @param playListTypes
 */
function initPlayListTypes(playListTypes) {
  _playListTypes = playListTypes;
}

function createMediaTemplate(folderId, tvizs) {
  let data = {
    folderId: folderId,
    tvizs: tvizs
  };

  $.ajax({
    type: 'POST',
    url: Routing.generate('api_v2_add_templates_tvizs_to_folder'),
    dataType: 'json',
    cache: false,
    data: data,
    success: function (folderId) {
      load_folder_templates(folderId);
      // console.log(folderId);
    }.bind(this),
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}






/**
 *
 */
let CatalogStore = assign({}, EventEmitter.prototype, {
  init: function () {

    $.ajax({
      url: Routing.generate('v2_api_playlist_types'),
      dataType: 'json',
      cache: false,
      success: function (data) {
        initPlayListTypes(data);
        this.emit(CHANGE_EVENT);
      }.bind(this),
      error: function (xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
      }
    });

    $.ajax({
      url: Routing.generate('v2_api_playlist_catalog_types'),
      dataType: 'json',
      cache: false,
      success: function (data) {
        initPlayListCatalogTypes(data);
        this.emit(CHANGE_EVENT);
      }.bind(this),
      error: function (xhr, status, err) {
        //console.error(this.props.url, status, err.toString());
      }
    });

  },

  getSelectedCatalogType: function () {
    return _selectedCatalogType;
  },

  /**
   * 
   * @returns {*}
   */
  getCatalogType: function () {
    return _catalogType;
  },

  /**
   *
   * @param target string
   */
  initSlimScroll: function (target) {
    $(target).slimScroll({
      height: '100%',
      width: '100%',
      size: '4px',
      position: 'right',
      color: '#eeeeee',
      distance: '4px',
      railVisible: false,
      wheelStep: 10
    });
  },
  
  /**
   *
   * @returns {Array}
   */
  getPlayListTypes: function () {
    return _playListTypes;
  },

  /**
   *
   * @returns {Array}
   */
  getPlayListCatalogTypes: function () {
    return _playListCatalogTypes;
  },

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
   * @returns {null}
   */
  getSelectedPlayList: function () {
    return _selectedPlayList;
  },

  /**
   * @returns {null}
   */
  resetSelectedPlayList: function () {
    _selectedPlayList = undefined;
    edit_playlist(null);
    CatalogStore.emitChange();
  },

  /**
   * @returns {boolean}
   */
  getShowAddPlayList: function () {
    return _openAddPlayList;
  },

  getSelectedFoldersIdArr: function () {
    return _selectedFoldersIdArr;
  },

  setSelectedFoldersIdArr: function (folderId, selectedFoldersIdArr) {

    if(typeof selectedFoldersIdArr === 'undefined') {
      selectedFoldersIdArr = [];
    }
    if(selectedFoldersIdArr.indexOf(folderId) < 0){
      selectedFoldersIdArr.push(folderId);
    } else {
      selectedFoldersIdArr.splice(selectedFoldersIdArr.indexOf(folderId), 1);
    }
    _selectedFoldersIdArr = selectedFoldersIdArr;


    this.emitChange();
  },

  addFolderToSelected: function (folderId) {
    if(_selectedFoldersIdArr.indexOf(folderId) < 0) {
      _selectedFoldersIdArr.push(folderId);
      this.emitChange();
    }
  }


});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case CatalogConstants.SET_SELECTED_PLAYLIST:
      _selectedPlayList = action.playList;
      CatalogStore.emitChange();
      break;

    case CatalogConstants.SHOW_ADD_PLAYLIST_DIALOG:
      _openAddPlayList = action.show;
      CatalogStore.emitChange();
      break;

    case CatalogConstants.SET_CATALOG_TYPE:
      _selectedCatalogType = action.catalogType;
      CatalogStore.emitChange();
      break;

    case CatalogConstants.SET_SELECTED_FOLDERS_IDS_ARR:
      CatalogStore.setSelectedFoldersIdArr(action.folderId, action.selectedFoldersIdArr);
      break;

    case CatalogConstants.CREATE_MEDIA_TEMPLATES:
      createMediaTemplate(action.folder, action.tvizs);
      break;




  
  }
});

module.exports = CatalogStore;