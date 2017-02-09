"use strict";
let React = require('react');
let Folder = require('./Folder.react');
let FolderForm = require('./FolderForm.react');
let TreeStore = require('../stores/TreeStore');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let MenuItem = require('react-bootstrap/lib/MenuItem');

/**
 *
 */
let Folders = React.createClass({
  PropTypes: {
    selectedFolderId: React.PropTypes.number,
    playlists: React.PropTypes.object

  },

  /**
   *
   * @returns {{folders: Array, filteredFolders: Array, playlists: Array, showNewFolderForm: boolean}}
   */
  getInitialState: function () {
    return {
      folders: [],
      filteredFolders: [],
      playlists: [],
      showNewFolderForm: false
    };
  },

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      folders: nextProps.folders,
      filteredFolders: nextProps.folders,
      playlists: nextProps.playlists
    });
  },

  /**
   *
   * @param eventKey
   * @param event
   * @private
   */
  _onMenuSelect: function (eventKey, event) {
    switch (eventKey) {
      case 'newFolder':
        this.setState({showNewFolderForm: true});
        break;
    }
  },

  /**
   *
   * @private
   */
  _closeNewFolderForm: function () {
    this.setState({showNewFolderForm: false});
  },

  /**
   *
   * @param e
   */
  handleSearchChange: function (e) {
    let {folders} = this.state;
    let searchText = e.target.value;
    let regexp = new RegExp(searchText, 'gi');

    if (searchText.length < 1) {
      this.setState({
        filteredFolders: folders
      });
      return;
    }

    /**
     *
     * @param folder
     * @returns {boolean}
     */
    function checkFolders(folder) {
      // search in children folders
      if (folder.children.length > 0) {
        for (let i = 0; i < folder.children.length; i++) {
          let child = folder.children[i];
          if (child.title.search(regexp) !== -1) {
            return true;
          }

          if (child.children.length > 0) {
            let matched = checkFolders(child);
            if (matched === true) {
              return true;
            }
          }
        }
        return false;
      }
    }

    this.setState({
      filteredFolders: folders.filter(function (folder) {
        if (folder.title.search(regexp) !== -1) {
          return true;
        }

        if (checkFolders(folder) === true) {
          return true;
        }

        // search in playlists

        return false;
      })
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {selectedFolderId, folders, selectedFoldersIdArr, selectedFoldersIDs, selectedPlayList} = this.props;
    let {showNewFolderForm} = this.state;
    let filteredFolders = folders.filter(function (folder) {
      return folder.deleted === false;
    }).map(function (folder) {

        let playlists = this.props.playlists.filter(function (playlist) {
          return playlist.folder_id === selectedFolderId;
        });
        return (
          <Folder playlists={playlists} key={folder.id}
                  folder={folder} selectedFolderId={selectedFolderId}
                  handleFolderItemClick={this.props.handleFolderItemClick}
                  selectedFoldersIdArr={selectedFoldersIdArr}
                  selectedFoldersIDs={selectedFoldersIDs}
                  selectedPlayList={selectedPlayList}
                  localStorageKey={folder.id}
          />
        );

    }, this);

    let newFolderForm = null;
    if (showNewFolderForm === true) {
      newFolderForm = <FolderForm show={true} onClose={this._closeNewFolderForm} action="create"/>
    }

    let addFolder = 'Add New Folder (Serial)';
    if(catalogType == 'advertising') {
      addFolder = 'Add New Ad Company';
    }

    return (
      <div className="box folders-box">

        <div id="bg-nested-dropdown" style={{cursor: 'pointer', marginLeft: '42px'}}>
          <span onClick={this._onMenuSelect.bind(this, 'newFolder')}>{addFolder}</span>
        </div>

        <div className="box-body">
          <div className="folders">
            {filteredFolders}
          </div>
        </div>
        {newFolderForm}
      </div>
    )
  }
});

/**
 *
 */
module.exports = Folders;