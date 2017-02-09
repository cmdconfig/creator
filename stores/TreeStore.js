"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let EventEmitter = require('events').EventEmitter;
let PlaylistActions = require('../actions/PlaylistActions');
let PlaylistConstants = require('../constants/PlaylistConstants');
let FolderConstants = require('../constants/FolderConstants');
let TreeConstants = require('../constants/TreeConstants');
let CatalogConstants = require('../constants/CatalogConstants');
let assign = require('object-assign');
let $ = require('jquery');
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
let _folders = [];
let constFolders = [];
let _lastSearch = '';
let allFinedPlayLists = [];

let _saveFoldersOfSelPlayList = [];

let _selectedFoldersIDs = [];
let _selectedFolder = [];

let lsSelFoldersIds = localStorage.getItem('selectedFoldersIDs');
if (lsSelFoldersIds !== 'undefined' && lsSelFoldersIds != null) {
  _selectedFoldersIDs = JSON.parse(lsSelFoldersIds);
}

let lsSelFolder = localStorage.getItem('selectedFolder');
if (lsSelFolder !== 'undefined' && lsSelFolder != null) {
  _selectedFolder = JSON.parse(lsSelFolder);
}
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
let _templates = [];


/**
 *
 * @type {number}
 * @private
 */
let _catalogSelectedType = 0;

/**
 *
 */
let _playlistFormIndex;

/**
 *
 * @param folders
 */
function initFolders(folders) {

  if(typeof folders === 'object') {
    folders = $.map(folders, function(value, index) {
      return [value];
    });
  }
  _folders = folders;
  constFolders = folders;

  if (_lastSearch.length > 0) {
    search(_lastSearch)
  } else {
    TreeStore.emitChange();
  }
}

function copyMediaTemplateToFolder(folder,tvizs) {
  let data = {
    folderId: folder.id,
    tvizs: tvizs
  };

  $.ajax({
    type: 'POST',
    url: Routing.generate('api_v2_copy_templates_tvizs_to_folder'),
    dataType: 'json',
    cache: false,
    data: data,
    success: function (data) {
      // load_folder_templates(folderId);

      // console.log(data);
      TreeStore.init(catalogType)
    }.bind(this),
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}

function deleteMediaTemplate(folderId,tvizs) {
  let data = {
    folderId: folderId,
    tvizs: tvizs
  };

  $.ajax({
    type: 'POST',
    url: Routing.generate('api_v2_delete_template_tvizs'),
    dataType: 'json',
    cache: false,
    data: data,
    success: function (data) {
      load_folder_templates(folderId);
      TreeStore.init(catalogType)

    }.bind(this),
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}


/**
 *
 * @param templates
 */
function initTemplates(templates) {
  _templates = templates;
}

/**
 *
 * @param folders
 * @param id
 * @returns {*}
 */
function findFolderById(folders, id) {
  for (let i = 0; i < folders.length; i++) {
    if (folders[i].id === id) {
      return folders[i];
    }
    if (folders[i].children.length > 0) {
      let result = findFolderById(folders[i].children, id);
      if (result !== false) {
        return result;
      }
    }
  }
  return false;
}


function deleteFolderFromTree(id) {
  for (let i = 0; i < _folders.length; i++) {
    if (_folders[i].id === id) {
      _folders.splice(i, 1);
      TreeStore.emitChange();
    }
    if (_folders[i].children.length > 0) {
      let result = findFolderById(id);
      if (result !== false) {
        return result;
      }
    }
  }
}
/**
 *
 * @param folders
 * @param parentId
 * @param folder
 */
function addChildrenFolder(folders, parentId, folder) {
  for (let [i, f] of folders.entries()) {
    if (f.id === parentId) {
      folders[i].children.push(folder);
    }
    if (f.children.length > 0) {
      addChildrenFolder(f.children, parentId, folder)
    }
  }
  initFolders(folders);
}

/**
 *
 * @param id
 * @param success
 */
function folderDelete(id, success) {
  $.ajax({
    type: 'delete',
    url: Routing.generate('v2_api_delete_folders', {id: id}),
    dataType: 'json',
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}

/**
 *
 * @param id
 */
function playlistDelete(playList) {
  edit_playlist(null);
  TreeStore.init(catalogType);

}

/**
 *
 * @param folder
 * @param success
 */
function folderCreate(folder, success) {
  let data = {
    folder: {
      title: folder.title,
      // template: typeof folder.template !== 'undefined' ? folder.template.id : null,
      liveProgram: folder.liveProgram ? 'yes' : 'no'
    },
    catalogType: CatalogStore.getCatalogType()
  };

  $.ajax({
    type: 'post',
    url: Routing.generate('v2_api_post_folders'),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}

/**
 *
 * @param parentId
 * @param folderName
 * @param liveProgram
 * @param success
 */
function folderCreateChildren(parentId, folderName, liveProgram, success) {
  CatalogStore.addFolderToSelected(parentId);
  let data = {
    parent_id: parentId,
    liveProgram: liveProgram ? 'yes' : 'no',
    folder: {
      title: folderName.title,
      template: typeof folderName.template !== 'undefined' ? folderName.template.id : null
    }
  };

  $.ajax({
    type: 'post',
    url: Routing.generate('v2_api_post_folder_create_children'),
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
 * @param id
 * @param success
 */
function playlistClone(id, success) {
  let playlist = _playlists.filter(function (playlist) {
    return playlist.id === id;
  })[0];

  $.ajax({
    type: 'post',
    url: Routing.generate('v2_api_post_playlists_copy', {id: playlist.id}),
    dataType: 'json',
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}

function searchInChildren(folder, searchText) {
  let tmpArr = [];

  if (folder.length > 0) {
    folder.map(function (f) {
      if (f.children.length > 0) {
        searchInChildren(f.children)

      }
    })
  } else {
    if (folder.children.length > 0) {
      searchInChildren(folder.children)
    }

    if (typeof folder.playlists === 'object') {
      for (let i = 0; i <= Object.keys(folder.playlists).length; i++) {
        tmpArr.push(folder.playlists[i])
      }
    } else {
      tmpArr = folder.playlists;
    }
    tmpArr = $.grep(tmpArr, function (n) {
      return n == 0 || n
    });

    if (tmpArr.length > 0) {
      let tmplaylist = [];

      tmpArr.map(function (pl) {
        if (typeof pl !== 'undefined') {
          if (pl.title.toLowerCase().includes(searchText.toLowerCase())) {
            tmplaylist.push(pl);
            allFinedPlayLists.push(pl);
          }
        }

      });

      if (tmplaylist.length > 0) {
        folder.playlists = tmplaylist;

        return folder;
      }
    }
  }
}

/**
 *
 * @param searchText string
 */
function search(searchText) {
  let newPlayListsTmp = [];
  allFinedPlayLists = [];

  _lastSearch = searchText;

  if (searchText.length == 0) {
    _folders = constFolders;
    TreeStore.emitChange();
    return;
  }

  $.each(constFolders, function (index, folder) {
    let data = searchInChildren(folder, searchText);
    if (data) {
      let newFolder = $.extend({}, folder);
      newFolder.children = data;
      newPlayListsTmp.push(newFolder);
    }
  });

  _folders = newPlayListsTmp;
  TreeStore.emitChange();
}

/**
 * @param folderData
 * @param success
 */
function folderUpdate(folderData, success) {
  let data = {
    folder: {
      title: folderData.title,
      template: typeof folderData.template !== 'undefined' ? folderData.template.id : null,
      liveProgram: folderData.liveProgram
    }
  };

  $.ajax({
    type: 'patch',
    url: Routing.generate('v2_api_patch_folders', {id: folderData.id}),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      console.error(this.props.url, status, err.toString());
    }
  });
}

/**
 * @param playlistData
 * @param children
 */
function palyListUpdateChildren(playlistData, children) {
  _playlists.map(function (val, i) {
    if (val.id == playlistData.id) {
      _playlists[i].children_play_list.push(children)
    }
  });
}

/**
 *
 * @param playlistData
 */
function playlistUpdate(playlistData) {
  TreeStore.init(catalogType);
  TreeStore.emitChange();
}

/**
 *
 * @param playListData
 * @param folderId
 * @param templateSelectedId
 * @param success
 */
function playListCreateItem(playListData, folderId, templateSelectedId, success) {
  if (isNaN(playListData.plType)) {
    playListData.plType = null
  }
  CatalogStore.addFolderToSelected(folderId);
  let data = {
    folder_id: folderId,
    play_list_data: playListData,
    templateSelectedId: typeof templateSelectedId !== 'undefined' ? templateSelectedId : null
  };

  $.ajax({
    type: 'POST',
    url: Routing.generate('v2_api_create_play_list_item'),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      // console.error(status, err.toString());
    }
  });
}

/**
 *
 * @param folderId
 * @param catalogTypeId
 * @param isFolder
 * @param success
 */
function getPlayListsByFolderAndCatalogType(folderId, catalogTypeId, isFolder, success) {
  let data = {
    folder_id: folderId,
    catalog_type_id: catalogTypeId,
    is_folder: isFolder
  };

  $.ajax({
    type: 'POST',
    url: Routing.generate('v2_api_playlists_by_folder_and_catalog_type'),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      // console.error(status, err.toString());
    }
  });
}

/**
 *
 * @param playListData
 * @param folderId
 * @param playlistParent
 * @param playlistType
 * @param success
 */
function playListCreateChildren(playListData, folderId, playlistParent, playlistType, success) {
  playListData.plType = playlistType;
  let data = {
    folder_id: folderId,
    play_list_data: playListData,
    playlist_parent: playlistParent
  };

  $.ajax({
    type: 'POST',
    url: Routing.generate('v2_api_create_play_list_item'),
    dataType: 'json',
    data: data,
    cache: false,
    success: success,
    error: function (xhr, status, err) {
      // console.error(status, err.toString());
    }
  });
}

/**
 *
 * @param id
 * @param published
 */
function playlistSetPublished(id, published) {
  let playlist = _playlists.filter(function (playlist) {
    return playlist.id === id;
  })[0];

  playlist.published = published;

  let data = {
    playlist: {}
  };
  if (published === true) {
    data.playlist.published = 1;
  }

  $.ajax({
    type: 'patch',
    url: Routing.generate('v2_api_patch_playlists', {id: playlist.id}),
    dataType: 'json',
    data: data,
    cache: false,
    success: function (data) {

    }.bind(this),
    error: function (xhr, status, err) {
      //console.error(this.props.url, status, err.toString());
    }
  });
}

/**
 *
 * @param playlists
 */
function initPlaylists(playlists) {
  _playlists = playlists;
}




/**
 *
 */
let TreeStore = assign({}, EventEmitter.prototype, {
  /**
   *
   */
  init: function (catalogType) {
    if(_playlists.length > 0) {
      return;
    }

    $.ajax({
      url: Routing.generate('v2_api_folders'),
      dataType: 'json',
      cache: false,
      data: {catalogType: catalogType},
      success: function (data) {
        initFolders(data);
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
   */
  initTemplatesList: function () {
    $.ajax({
      url: Routing.generate('v2_api_get_template_list'),
      dataType: 'json',
      cache: false,
      success: function (data) {
        initTemplates(data);
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(status, err.toString());
      }.bind(this)
    });
  },

  /**
   *
   * @returns {Array}
   */
  getTemplateList: function () {
    return _templates;
  },

  /**
   *
   * @returns {Array.<*>}
   */
  getActivePlayLists: function () {
    return _playlists.sort(function (a, b) {
      if (a.created < b.created) {
        return 1;
      }
      if (a.created > b.created) {
        return -1;
      }
      return 0;
    });
  },

  /**
   *
   * @returns {Array.<*>}
   */
  getFolders: function () {
    return _folders.sort(function (a, b) {
      if (a.created < b.created) {
        return 1;
      }
      if (a.created > b.created) {
        return -1;
      }
      return 0;
    });
  },

  /**
   *
   * @returns {number}
   */
  getCatalogSelectedType: function () {
    return _catalogSelectedType;
  },

  getPlaylists: function () {
    return _playlists.sort(function (a, b) {
      if (a.created < b.created) {
        return 1;
      }
      if (a.created > b.created) {
        return -1;
      }
      return 0;
    });
  },

  getSelectedFolder: function () {
    return _selectedFolder
  },

  /**
   *
   * @returns {*}
   */
  getPlaylistFormIndex: function () {
    return _playlistFormIndex;
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

  getSaveFoldersOfSelPlayList: function () {
    return _saveFoldersOfSelPlayList;
  },

  getSelectedFoldersIds: function () {
    return _selectedFoldersIDs;
  }
});

function addToChildrenConstPlayList(data, folder, i) {
  if (data.folder_id == folder.id) {
    folder.playlists.push(data);
  } else {
    if (folder.children.length > 0) {
      folder.children.map(function (fChildren, iCh) {
        if (fChildren.children.length > 0) {
          addToChildrenConstPlayList(data, fChildren, iCh);
        }
      });
    }

  }

  return folder;

}

function addConstPlayList(data) {

  constFolders.map(function (folder, i) {
    if (data.folder_id == folder.id) {
      constFolders[i].playlists.push(data);
    } else {
      if (folder.children.length > 0) {
        constFolders[i] = addToChildrenConstPlayList(data, folder, i)
      }

    }
  });

  _playlists.map(function (folder, i) {
    if (data.folder_id == folder.id) {
      _playlists[i].playlists.push(data);
    } else {
      if (folder.children.length > 0) {
        _playlists[i] = addToChildrenConstPlayList(data, folder, i)
      }

    }
  });

}
/**
 *
 */
AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case PlaylistConstants.UPDATE:
      playlistUpdate(action.playlist);
      break;

    case PlaylistConstants.PUBLISH:
      playlistSetPublished(action.id, true);
      TreeStore.emitChange();
      break;

    case PlaylistConstants.UNPUBLISH:
      playlistSetPublished(action.id, false);
      TreeStore.emitChange();
      break;

    case PlaylistConstants.DELETE:
      // console.log('TreeStore playList DELETE');
      playlistDelete(action.id);
      break;

    case PlaylistConstants.CLONE:
      playlistClone(action.id, function (data) {
        _playlists.push(data);
        TreeStore.emitChange();
      });
      break;

    case PlaylistConstants.CREATE:
      playListCreateItem(action.playListData, action.folderId, action.templateSelectedId, function (data) {
        TreeStore.init(catalogType);
      });
      break;

    case PlaylistConstants.CREATE_CHILDREN:
      playListCreateChildren(action.playListData, action.folderId, action.playlistParent, action.playlistType, function (data) {
        palyListUpdateChildren(action.playlistParent, data);
        TreeStore.emitChange();
      });
      break;

    case FolderConstants.FOLDER_CREATE:
      folderCreate(action.folder, function (data) {
        // _folders.push(data);
        TreeStore.init(catalogType);
        // TreeStore.emitChange();
      });
      break;

    case FolderConstants.FOLDER_CREATE_CHILDREN:
      folderCreateChildren(action.parentId, action.folderName, action.liveProgram, function (data) {
        TreeStore.init(catalogType);
      });
      break;

    case FolderConstants.FOLDER_DELETE:
      folderDelete(action.id, function () {
        TreeStore.init(catalogType);
        // deleteFolderFromTree(action.id)
      });
      break;

    case FolderConstants.FOLDER_UPDATE:
      folderUpdate(action.folder, function () {

        let folder = findFolderById(_folders, action.folder.id);

        folder.title = action.folder.title;
        folder.template = action.folder.template;
        folder.live_program = action.folder.liveProgram;

        TreeStore.emitChange();
      });
      break;

    case TreeConstants.SEARCH_IN_TREE:
      search(action.searchText);
      break;

    case CatalogConstants.SET_SELECTED_PLAYLIST:
      if (_selectedFoldersIDs.length > 0) {
        // _saveFoldersOfSelPlayList = _selectedFoldersIDs;
      }

      // TreeStore.emitChange();
      break;

    case TreeConstants.SET_SELECTED_FOLDER_IDS:
      _selectedFoldersIDs = action.selectedFoldersIDs;
      _selectedFolder = action.folderId;

      localStorage.setItem('selectedFoldersIDs', JSON.stringify(_selectedFoldersIDs));
      localStorage.setItem('selectedFolder', _selectedFolder);

      TreeStore.emitChange();
      break;
    case CatalogConstants.UPDATE_CATALOG:
      if (CatalogStore.getSelectedCatalogType() == 'Tree') {
        TreeStore.init(catalogType);
      }
      break;

    case TreeConstants.CLEAR_SELECTED_FOLDERS_IDS:
      if (playList !== 'undefined' && _selectedFoldersIDs.indexOf(action.playList.folder_id) < 0) {
        _selectedFoldersIDs = [];
        localStorage.removeItem('selectedFoldersIDs');
        TreeStore.emitChange();
      }
      break;

    case TreeConstants.COPY_MEDIA_TEMPLATES_TO_FOLDER:
      // console.log('COPY_MEDIA_TEMPLATES_TO_FOLDER');
      copyMediaTemplateToFolder(action.folder,  action.tvizs);
      break;

    case TreeConstants.DELETE_MEDIA_TEMPLATES:
      deleteMediaTemplate(action.folder,  action.tvizs);
      break;
  
  }
});

module.exports = TreeStore;