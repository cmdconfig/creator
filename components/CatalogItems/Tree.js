"use strict";
let React = require('react');
let Folders = require('../Folders.react');
let TreeStore = require('../../stores/TreeStore');
let PlaylistActions = require('../../actions/PlaylistActions');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let CatalogStore = require('../../stores/CatalogStore');
let TreeActions = require('../../actions/TreeActions');
let CatalogActions = require('../../actions/CatalogActions');
/**
 *
 * @returns {{playlists: *, folders: (*|Array.<*>), playListCatalogTypes: (*|Array), selectedType: (*|number), playListFiltrated: *}}
 */
function getCatalogState() {
  return {
    playlists: TreeStore.getPlaylists(),
    folders: TreeStore.getFolders(),
    playListCatalogTypes: CatalogStore.getPlayListCatalogTypes(),
    selectedType: TreeStore.getCatalogSelectedType(),
    playListFiltrated: TreeStore.getPlaylists(),
    playListTypes: CatalogStore.getPlayListTypes(),
    selectedFoldersIDs: TreeStore.getSelectedFoldersIds(),
    saveFoldersOfSelPlayList: TreeStore.getSaveFoldersOfSelPlayList(),
    lastSearch: TreeStore.getLastSearch(),
    selectedFolder: TreeStore.getSelectedFolder()
  }
}

let Tree = React.createClass({
  /**
   *
   * @returns {{playlists, folders, playListCatalogTypes, selectedType, playListFiltrated}}
   */
  getInitialState: function () {
    // let {catalogType} = this.props;
    TreeStore.init(catalogType);
    TreeStore.initTemplatesList();

    return getCatalogState();
  },

  _onCatalogSelectPlayList: function () {
    this.setState({
      selectedPlayList: CatalogStore.getSelectedPlayList()
    });
  },


  componentWillMount: function () {
    this.props.setLastSearchText(TreeStore.getLastSearch());
    TreeStore.addChangeListener(this._onChange);
    TreeStore.addChangeListener(this._onCatalogSelectPlayList);
  },

  /**
   *
   */
  componentDidMount: function () {
    CatalogStore.initSlimScroll('.box-body');
    if(catalogType == 'media') {
      load_folder_templates(TreeStore.getSelectedFolder());
    }
  },

  /**
   *
   */
  componentWillUnmount: function () {
    TreeStore.removeChangeListener(this._onChange);
    TreeStore.removeChangeListener(this._onCatalogSelectPlayList);
    $('.catalog-box').slimScroll({destroy: true});
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function () {
    this.setState(getCatalogState());
  },

  /**
   *
   * @returns {*}
   */
  getFolders: function () {
    let {folders} = this.state;
    return folders.filter(function (f) {
      return f.deleted === false;
    });
  },

  /**
   *
   * @param folder
   */
  handleFolderItemClick: function (folder) {

    let {selectedFoldersIdArr, selectedPlayList} = this.props;
    let {selectedFoldersIDs} = this.state;

    CatalogActions.setSelectedFolderIDsArr(folder.id, selectedFoldersIdArr);

    if (typeof selectedFoldersIDs === 'undefined' || selectedFoldersIDs.length == 0 || selectedFoldersIDs.length == 0) {
      selectedFoldersIDs = [];
      selectedFoldersIDs.push(folder.id);
    }

    if (selectedFoldersIDs.indexOf(folder.parent_id) >= 0 && selectedFoldersIDs.indexOf(folder.id) < 0) {
      selectedFoldersIDs.push(folder.id);

    } else {
      if (selectedFoldersIDs.indexOf(folder.id) < 0 && selectedFoldersIDs.indexOf(folder.parent_id) < 0) {
        let addFolderId = false;
        if(folder.children.length > 0){
          folder.children.map(function (chFolder) {
            if(selectedFoldersIDs.indexOf(chFolder.id) >= 0){
              addFolderId = true;
            }
          });
        }

        if(typeof folder.playlists !== 'undefined' && folder.playlists.length > 0){
          folder.playlists.map(function (pl)  {
            if(typeof selectedPlayList !== 'undefined' && selectedPlayList.id == pl.id ) {
              addFolderId = true;
            }
          });
        }
        if(addFolderId) {
          selectedFoldersIDs.push(folder.id);
        }
      }
    }

    this.setState({
      selectedFolder: folder.id,
      selectedType: 0
    });

    TreeActions.setSelectedFolderIDs(selectedFoldersIDs, folder.id);

    if(catalogType == 'media'){
/*      folder.children.map(function(f){
        if(f.title == 'Templates'){
          load_folder_templates(f);
        }
      });*/
      load_folder_templates(folder);
    }
  },

  

  /**
   *
   * @param eventKey
   */
  handleCatalogTypeChange: function (eventKey) {
    let {playlists, selectedFolder} = this.state;

    let tmp = [];

    playlists.map(function (pl) {
      if (pl.catalog_type == eventKey.catalogTypeId || eventKey.catalogTypeId == 0) {
        tmp.push(pl);
      }
    });

    this.setState({
      selectedType: eventKey.catalogTypeId,
      playListFiltrated: tmp
    });

    if (selectedFolder == null) {
      PlaylistActions.getPlayListByCatalogType(selectedFolder, eventKey.catalogTypeId, false);
    }
  },

  handleRemovePlayList: function () {

  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {playListCatalogTypes, selectedFolder, playlists, selectedFoldersIDs} = this.state;
    let {selectedFoldersIdArr, selectedPlayList} = this.props;

  
    let menuItem = [];

    for (let key in playListCatalogTypes) {
      menuItem.push(<MenuItem key={key}
                              eventKey={{folderId:selectedFolder,catalogTypeId:key}}>{playListCatalogTypes[key]}</MenuItem>)
    }

    return (
      <Folders 
               className="catalog-tree" handleFolderItemClick={this.handleFolderItemClick}
               selectedFolderId={selectedFolder}
               folders={this.getFolders()} playlists={playlists}
               selectedFoldersIdArr={selectedFoldersIdArr}
               selectedFoldersIDs={selectedFoldersIDs}
               selectedPlayList={selectedPlayList}
      />    )
  }
});

module.exports = Tree;
