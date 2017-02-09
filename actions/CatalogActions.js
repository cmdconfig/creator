"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let CatalogConstants = require('../constants/CatalogConstants');

/**
 *
 * @type {{setSelectedPlayList: CatalogActions.setSelectedPlayList, addPlayListDialog: CatalogActions.addPlayListDialog}}
 */
let CatalogActions = {

  /**
   *
   * @param playList
   */
  setSelectedPlayList: function (playList) {
    AppDispatcher.dispatch({
      actionType: CatalogConstants.SET_SELECTED_PLAYLIST,
      playList: playList
    })
  },

  /**
   *
   * @param show
   */
  addPlayListDialog: function (show) {
    AppDispatcher.dispatch({
      actionType: CatalogConstants.SHOW_ADD_PLAYLIST_DIALOG,
      show: show
    });
  },
  
  setSelectedCatalogType: function (catalogType) {
    AppDispatcher.dispatch({
      actionType: CatalogConstants.SET_CATALOG_TYPE,
      catalogType: catalogType
    });
  },

  /**
   * 
   * @param folderId
   * @param selectedFoldersIdArr
   */
  setSelectedFolderIDsArr: function (folderId, selectedFoldersIdArr) {
    AppDispatcher.dispatch({
      actionType: CatalogConstants.SET_SELECTED_FOLDERS_IDS_ARR,
      folderId: folderId,
      selectedFoldersIdArr: selectedFoldersIdArr
    })
  },

  createMediaTemplates: function (folder, tvizs) {
    AppDispatcher.dispatch({
      actionType: CatalogConstants.CREATE_MEDIA_TEMPLATES,
      folder: folder,
      tvizs: tvizs
    })
  },




};

module.exports = CatalogActions;