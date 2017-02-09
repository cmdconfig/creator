"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let FolderConstants = require('../constants/FolderConstants');

/**
 *
 * @type {{delete: FolderActions.delete, update: FolderActions.update, create: FolderActions.create, createChildrenFolder: FolderActions.createChildrenFolder}}
 */
let FolderActions = {
  /**
   *
   * @param id
   */
  delete: function (id) {
    AppDispatcher.dispatch({
      actionType: FolderConstants.FOLDER_DELETE,
      id: id
    });
  },

  /**
   *
   * @param folder
   */
  update: function (folder) {
    AppDispatcher.dispatch({
      actionType: FolderConstants.FOLDER_UPDATE,
      folder: folder
    });
  },

  /**
   *
   * @param folder
   */
  create: function (folder) {
    // console.log(folder);
    
    AppDispatcher.dispatch({
      actionType: FolderConstants.FOLDER_CREATE,
      folder: folder
    });
  },

  /**
   *
   * @param parentId
   * @param folderName
   * @param liveProgram
   */
  createChildrenFolder: function (parentId, folderName, liveProgram) {
    AppDispatcher.dispatch({
      actionType: FolderConstants.FOLDER_CREATE_CHILDREN,
      parentId: parentId,
      folderName: folderName,
      liveProgram: liveProgram
    });
  }
};

module.exports = FolderActions;