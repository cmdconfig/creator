"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let TreeConstants = require('../constants/TreeConstants');

/**
 *
 * @type {{search: TreeActions.search, setSelectedFolderIDs: TreeActions.setSelectedFolderIDs}}
 */
let TreeActions = {

  /**
   *
   * @param searchText
   */
  search: function (searchText) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.SEARCH_IN_TREE,
      searchText: searchText
    })
  },

  /**
   * 
   * @param selectedFoldersIDs
   * @param folderId
   */
  setSelectedFolderIDs: function (selectedFoldersIDs, folderId) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.SET_SELECTED_FOLDER_IDS,
      selectedFoldersIDs: selectedFoldersIDs,
      folderId: folderId
    })
  },
  
  clearSelectedFoldersIDs: function (playList) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.CLEAR_SELECTED_FOLDERS_IDS,
      playList: playList
    })
  },

  copyMediaTemplateToFolder: function (folder, tvizs) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.COPY_MEDIA_TEMPLATES_TO_FOLDER,
      folder: folder,
      tvizs: tvizs
    })
  },

  deleteMediaTemplates: function (folder, tvizs) {
    AppDispatcher.dispatch({
      actionType: TreeConstants.DELETE_MEDIA_TEMPLATES,
      folder: folder,
      tvizs: tvizs
    })
  },
};

module.exports = TreeActions;