"use strict";
let React = require('react');
let PlaylistItem = require('./PlaylistItem.react');
let TreeStore = require('../stores/TreeStore');
let TreeActions = require('../actions/TreeActions');
let FolderForm = require('./FolderForm.react');
let ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
let Button = require('react-bootstrap/lib/Button');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let FolderActions = require('../actions/FolderActions');
let PlaylistActions = require('../actions/PlaylistActions');
let PlaylistForm = require('./PlaylistForm.react');
let $ = require('jquery');

// React tutorial https://facebook.github.io/react/docs/tutorial.html
// http://stackoverflow.com/questions/22639534/pass-props-to-parent-component-in-react-js

// Flux cheatsheet http://ricostacruz.com/cheatsheets/flux.html

let ChildrenNodes = React.createClass({
  // PropTypes: {
  //   value: React.PropTypes.object,
  //   saveFoldersOfSelPlayList: React.PropTypes.object
  //   selectedFolderId: React.PropTypes.object
  // },


  render: function () {
    let {value, selectedFolderId, selectedFoldersIdArr, selectedPlayList, selectedFoldersIDs} = this.props;
    if(value.title == 'Templates' && catalogType == 'media') {
      return null;
    }
    return <div>
      <Folder
          folder={value}
          selectedFoldersIDs={selectedFoldersIDs}
          key={value.id}
          selectedFolderId={selectedFolderId}
          playlists={value.playlists}
          handleFolderItemClick={this.props.handleFolderItemClick}
          selectedFoldersIdArr={selectedFoldersIdArr}
          selectedPlayList={selectedPlayList}
      />
    </div>
  }

});

/**
 *
 */
let Folder = React.createClass({
  PropTypes: {
    folder: React.PropTypes.object,
    playlists: React.PropTypes.object
  },

  /**
   *
   * @returns {{playlists: Array, showNewTvizActionDialog: boolean}}
   */
  getDefaultProps: function () {
    return {
      playlists: [],
      showNewTvizActionDialog: false
    }
  },

  /**
   *
   * @returns {{expanded: *, selected: boolean, showMenu: boolean, showSettings: boolean, showNewTvizActionDialog: boolean, showAddTemplateForm: boolean}}
   */
  getInitialState: function () {
    return {
      expanded: false,
      selected: false,
      showMenu: false,
      showSettings: false,
      showNewTvizActionDialog: false,
      showAddTemplateForm: false,
      dialogType: undefined,
      selectedFolder: TreeStore.getSelectedFolder()
    }
  },

  handleCopyMedia: function () {
    let {folder, selectedFolderId} = this.props;
    // console.log('handleCopyMedia', folder, id_check);

    TreeActions.copyMediaTemplateToFolder(folder, id_check[selectedFolderId]);
  },
  /**
   *
   * @returns {string}
   */
  guid: function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
  },

  /**
   *
   * @private
   */
  _toggleNewActionDialog: function () {
    let {showNewTvizActionDialog} = this.state;
    this.setState({
      showNewTvizActionDialog: !showNewTvizActionDialog
    });
  },

  /**
   *
   * @param event
   * @private
   */
  _toggleExpanded: function (event) {
    let {expanded} = this.state;
    let {folder, selectedFolderId} = this.props;
    expanded = !expanded;
    this.setState({
      expanded: expanded,
      // selected: folder.id == selectedFolderId
    });

    this.props.handleFolderItemClick(folder);
  },

  /**
   *
   * @param event
   * @private
   */
  _toggleExpandedChildren: function (event) {
    let {folder, selectedFolderId} = this.props;
    let {expanded} = this.state;

    if (selectedFolderId == folder.parent_id || folder.parent_id == 8) {
      expanded = !expanded;
    }

    this.setState({expanded: expanded});

    this.props.handleFolderItemClick(folder.id, folder);
  },

  /**
   *
   * @private
   */
  _toggleMenu: function () {
    let {showMenu} = this.state;
    let showMenuLet = !showMenu;
    this.setState({showMenu: showMenuLet})
  },

  /**
   *
   * @private
   */
  _showMenu: function () {
    this.setState({showMenu: true})
  },

  /**
   *
   * @private
   */
  _hideMenu: function () {
    this.setState({showMenu: false})
  },

  /**
   *
   * @private
   */
  _closeSettings: function () {
    this.setState({showSettings: false})
  },

  deleteFolder: function () {
    let {folder} = this.props;
    FolderActions.delete(folder.id)
  },

  /**
   *
   * @param eventKey
   * @param e
   * @private
   */
  _onMenuSelect: function (eventKey, e) {
    let {folder} = this.props;

    switch (eventKey) {
      case 'delete':
        deleteFolder(folder, this.deleteFolder);
        // FolderActions.delete(folder.id);
        break;

      case 'edit':
        this.setState({showSettings: true});
        break;

      case 'newFolderChildrenFolder':
        this.setState({
          showNewFolderForm: true,
          expanded: true
        });
        break;

      case 'showNewActionDialogCreate':
        this.setState({
          dialogType: 'create'
        });
        this._toggleNewActionDialog();
        break;

      case 'showNewActionDialogTemplate':
        this.setState({
          dialogType: 'template'
        });
        this._toggleNewActionDialog();

        break;

      case 'addTemplate':
        this.setState({
          showNewFolderForm: true,
          expanded: true
        });
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

  componentWillReceiveProps: function (nextProps) {
    this.setState({
      selectedFolderId: nextProps.selectedFolderId
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let childNodes = null;
    let playlistNodes = null;
    let {folder, selectedFolderId, selectedFoldersIdArr, selectedPlayList, selectedFoldersIDs} = this.props;
    let {showMenu, selected, dialogType} = this.state;
    let folderClassName = 'folder list-item';
    let folderHeaderClassName = 'header';
    let playlistForm;
    let children = [];
    let iconNode;
    let iconClassName;
    let menu = null;
    let folderForm = null;
    let folderSelected = '';

    if((folder.title == 'Templates' && catalogType == 'media') || (folder.title == 'Templates' && folder.parent_id == 8 )) {
      return null;
    }

    let expanded =
        !(
            (typeof selectedFoldersIDs !== 'undefined' && selectedFoldersIDs.indexOf(folder.id) >= 0) &&
            (typeof selectedFoldersIdArr !== 'undefined' && selectedFoldersIdArr.indexOf(folder.id) < 0 )
        );

    if (typeof folder.children !== 'undefined' && folder.children.length > 0) {
      children = folder.children.filter(function (folder) {
        return folder.deleted === false;
      });
    }

    if ((typeof selectedFoldersIdArr !== 'undefined' && selectedFoldersIdArr.indexOf(folder.id) >= 0 )){
      childNodes = children.map(function (value) {

        return <ChildrenNodes
            key={value.id}
            value={value}
            selectedFoldersIDs={selectedFoldersIDs}
            selectedFolderId={selectedFolderId}
            handleFolderItemClick={this.props.handleFolderItemClick}
            selectedFoldersIdArr={selectedFoldersIdArr}
            selectedPlayList={selectedPlayList}
        />;

      }, this);
    }

    if ((typeof selectedFoldersIdArr !== 'undefined' && selectedFoldersIdArr.indexOf(folder.id) >= 0 )) {
      let tmpArr = [];

      if(typeof folder.playlists !== 'undefined'){
        if (typeof folder.playlists === 'object') {
          $.each(folder.playlists, function (index, value) {
            tmpArr.push(value)
          });

        } else {
          tmpArr = folder.playlists;
        }

        tmpArr = $.grep(tmpArr, function (n) {
          return n == 0 || n
        });
      }

      playlistNodes = tmpArr.map(function (playlist) {
        if (playlist.folder_id == folder.id) {
          folderSelected = '';
          folderClassName += ' expanded';
        }

        if ((typeof selectedFoldersIdArr !== 'undefined' && selectedFoldersIdArr.indexOf(folder.id) >= 0 )) {
          return <PlaylistItem folder={folder} key={playlist.id} playlist={playlist} type="tree" selectedPlayList={selectedPlayList}/>
        }
        return false;
      }, this);
    }

    if ((typeof selectedFoldersIdArr !== 'undefined' && selectedFoldersIdArr.indexOf(folder.id) >= 0 )) {
      iconClassName = 'fa  fa-caret-down';
    } else {
      iconClassName = 'fa fa-caret-right';
    }

    let deleteButton = null;

    if (typeof folder.playlists !== 'undefined' &&
        (folder.playlists.length == 0 && folder.children.length == 0)
    )  {

      iconClassName = 'fa fa_0';
      deleteButton = <MenuItem eventKey="delete" onSelect={this._onMenuSelect}>Delete</MenuItem>;
    }


    if(catalogType == 'media') {

      if(folder.children.length > 0) {
        let noTemplates = true;
        folder.children.map(function (chFolder) {
          if(chFolder.title == 'Templates') {
            return null;
          }
          if(chFolder.is_empty) {
            noTemplates = false;
          }
        });

        if(noTemplates) {
          iconClassName = 'fa fa_0';
          // folderClassName += ' no_templates';
        }
      }

      if(folder.is_empty) {
        folderClassName += ' no_templates';
      }

      if(folder.children.length == 0) {
        iconClassName = 'fa fa_0';
      }

    }

    if (!expanded || folder.id == selectedFolderId) {
      folderSelected = 'selected'
    }

    iconNode = (<span className={iconClassName} style={{marginLeft: '13px'}}/>);

    let hasTemplate = null;
    let templateList = undefined;
    let childrenPl = [];
    if (typeof folder.children === 'object') {
      $.each(folder.children, function (index, value) {
        childrenPl.push(value)
      });
    } else {
      childrenPl = folder.children;
    }

    if(childrenPl.length > 0 ) {
      childrenPl.map(function (ch) {
        if(ch.title == 'Templates') {
          if(typeof ch.playlists !== 'undefined' && ch.playlists.length > 0) {
            templateList = ch.playlists;

            hasTemplate = <MenuItem eventKey="showNewActionDialogTemplate" onSelect={this._onMenuSelect}>
              New playlist fom template</MenuItem>
          }
        }
      },this);
    }

    let addFolder = 'New Folder';
    if(catalogType == 'advertising') {
      addFolder = 'New Ad Company';
    }

    if (showMenu === true && catalogType != 'media') {
      menu = (
          <DropdownButton title={
          <span><i className="glyphicon glyphicon-option-vertical" /></span>
        } id="bg-nested-dropdown" className="edit-folder" noCaret={true}>
            <MenuItem eventKey="newFolderChildrenFolder" onSelect={this._onMenuSelect}>{addFolder}</MenuItem>
            <MenuItem eventKey="edit" onSelect={this._onMenuSelect}>Rename</MenuItem>
            <MenuItem divider="divider"/>
            <MenuItem eventKey="showNewActionDialogCreate" onSelect={this._onMenuSelect}>New playlist</MenuItem>

            {hasTemplate}
            {deleteButton ? <MenuItem /> : null }
            {deleteButton}
          </DropdownButton>
      );
    }

    if (showMenu === true && catalogType == 'media') {
      menu = (
          <Button id="123123"><span><i style={{color: 'white'}} onClick={this.handleCopyMedia} className="glyphicon glyphicon-option-vertical" /></span></Button>
      );
    }

    if (this.state.showSettings === true) {
      folderForm = <FolderForm templateList={this.props.templateList} folder={folder}
                               action="update" show={true} dialogType={dialogType} onClose={this._closeSettings}/>
    }

    let newFolderForm = null;
    if (this.state.showNewFolderForm === true) {
      newFolderForm =
          <FolderForm newFolder={true} templateList={this.props.templateList} show={true} folder={folder}
                      onClose={this._closeNewFolderForm}
                      action="newFolderChildrenFolder" parentId={folder.id}/>
    }

    if (this.state.showNewTvizActionDialog === true && childNodes != null &&  childNodes.length >= 0) {
      playlistForm =
          <PlaylistForm dialogType={dialogType} templateList={templateList}
                        show={true}
                        action="create" folderId={folder.id} onClose={this._toggleNewActionDialog}/>
    }

    if(folder.title == 'Templates'){
      menu = null;
    }

    let title =  folder.title;
    if (title.length > 41) {
      let tmpTitle = title.substr(0, 24) + ' ... ';
      title = tmpTitle + title.substr(title.length - 12, 12)
    }
    return (
        <div className={folderClassName}>
          <div className={folderSelected}></div>
          <div className={folderHeaderClassName} onMouseEnter={this._showMenu} onMouseLeave={this._hideMenu}>
            <div className="icon" onClick={this._toggleExpanded}>{iconNode}</div>
            <div className="menu">
              {menu}
            </div>
            <div className="title" onClick={this._toggleExpanded}>{title}</div>
          </div>
          <div className="children" key={this.guid}>
            {childNodes}
          </div>
          <ul className="playlists list-unstyled">
            {playlistNodes}
          </ul>
          {folderForm}
          {newFolderForm}
          {playlistForm}
        </div>
    );
  }
});

/**
 *
 */
module.exports = Folder;