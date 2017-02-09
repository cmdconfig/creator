"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let EditingConstants = require('../constants/EditingConstants');

/**
 *
 * @type {{createTemplate: EditingAction.createTemplate, saveEditForm: EditingAction.saveEditForm, saveChangedPlayList: EditingAction.saveChangedPlayList, sortEditList: EditingAction.sortEditList, search: EditingAction.search}}
 */
let EditingAction = {

  /**
   *
   * @param playListId
   */
  createTemplate: function (playListId) {
    AppDispatcher.dispatch({
      actionType: EditingConstants.CREATE_TEMPLATE,
      playListId: playListId
    })
  },

  /**
   *
   * @param playList
   */
  saveEditForm: function (playList) {
    AppDispatcher.dispatch({
      actionType: EditingConstants.SAVE_TEMPLATE,
      playList: playList

    })
  },

  /**
   *
   * @param playListId
   * @param repeat
   */
  saveChangedPlayList: function (playListId, repeat) {
    AppDispatcher.dispatch({
      actionType: EditingConstants.SAVE_CHANGED_PLAY_LIST,
      playListId: playListId,
      repeat: repeat
    })
  },

  /**
   *
   * @param sortBy
   */
  sortEditList: function (sortBy) {
    AppDispatcher.dispatch({
      actionType: EditingConstants.SORT_EDITING,
      sortBy: sortBy
    })
  },

  /**
   *
   * @param searchText
   */
  search: function (searchText) {
    AppDispatcher.dispatch({
      actionType: EditingConstants.SEARCH_EDITING,
      searchText: searchText
    })
  }
};

module.exports = EditingAction;