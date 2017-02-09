"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let PlaylistConstants = require('../constants/PlaylistConstants');

/**
 *
 * @type {{togglePublish: PlaylistActions.togglePublish, update: PlaylistActions.update, showForm: PlaylistActions.showForm, delete: PlaylistActions.delete, clone: PlaylistActions.clone, create: PlaylistActions.create, createChildren: PlaylistActions.createChildren, getPlayListByCatalogType: PlaylistActions.getPlayListByCatalogType}}
 */
let PlaylistActions = {

  // example: https://github.com/facebook/flux/blob/master/examples/flux-todomvc/js/actions/TodoActions.js#L43

  /**
   * Toggle wheter a playlist is published
   *
   * @param {object} playlist
   */
  togglePublish: function (playlist) {
    let id = playlist.id;
    let actionType = playlist.published ?
      PlaylistConstants.UNPUBLISH :
      PlaylistConstants.PUBLISH;

    AppDispatcher.dispatch({
      actionType: actionType,
      id: id
    })
  },

  /**
   *
   * @param playlist
   */
  update: function (playlist) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.UPDATE,
      playlist: playlist
    })
  },

  /**
   *
   * @param playlist
   */
  showForm: function (playlist) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.SHOW_FORM,
      playlist: playlist
    })
  },

  /**
   *
   * @param id
   */
  delete: function (id) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.DELETE,
      id: id
    });
  },

  /**
   *
   * @param id
   */
  clone: function (id) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.CLONE,
      id: id
    });
  },

  /**
   *
   * @param playListData
   * @param folderId
   * @param templateSelectedId
   */
  create: function (playListData, folderId, templateSelectedId) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.CREATE,
      playListData: playListData,
      folderId: folderId,
      templateSelectedId: templateSelectedId
    });
  },

  /**
   *
   * @param playListData
   * @param playlistParent
   * @param playlistType
   */
  createChildren: function (playListData, playlistParent, playlistType) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.CREATE_CHILDREN,
      playListData: playListData,
      isChildren: true,
      playlistParent: playlistParent,
      playlistType: playlistType
    });
  },

  /**
   *
   * @param folderId
   * @param catalogTypeId
   * @param isFolder
   */
  getPlayListByCatalogType: function (folderId, catalogTypeId, isFolder) {
    AppDispatcher.dispatch({
      actionType: PlaylistConstants.GET_PLAY_LIST_BY_CATALOG_TYPE,
      folderId: folderId,
      catalogTypeId: catalogTypeId,
      isFolder: isFolder
    });
  }
};

module.exports = PlaylistActions;