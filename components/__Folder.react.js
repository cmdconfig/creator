let React = require('react');
let PlaylistItem = require('./PlaylistItem.react');
let TreeStore = require('../stores/TreeStore');
let FolderForm = require('./FolderForm.react');
let ButtonGroup = require('react-bootstrap/lib/ButtonGroup');
let Button = require('react-bootstrap/lib/Button');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let FolderActions = require('../actions/FolderActions');
let PlaylistActions = require('../actions/PlaylistActions');
let PlaylistForm = require('./PlaylistForm.react');

// React tutorial https://facebook.github.io/react/docs/tutorial.html
// http://stackoverflow.com/questions/22639534/pass-props-to-parent-component-in-react-js

// Flux cheatsheet http://ricostacruz.com/cheatsheets/flux.html

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
      showNewTvizActionDialog: false,

    }
  },

  /**
   *
   * @returns {{expanded: *, selected: boolean, showMenu: boolean, showSettings: boolean, showNewTvizActionDialog: boolean, showAddTemplateForm: boolean}}
   */
  getInitialState: function () {
    let {folder}= this.props;

    return {
      // expanded: folder.children.filter(function (folder) {
      //   return !folder.deleted;
      // }),
      expanded: false,
      selected: false,
      showMenu: false,
      showSettings: false,
      showNewTvizActionDialog: false,
      showAddTemplateForm: false,
      dialogType: undefined
    }
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
    let {folder, selectedFolderId} = this.props;
    let {expanded} = this.state;
    let expandedLet = !expanded;

    this.setState({expanded: expandedLet});

    this.props.handleFolderItemClick(folder.id, folder);

    if (expandedLet === true) {
      this.setState({selected: true})
    } else {

      this.setState({selected: false})
    }
    event.stopPropagation();
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
        FolderActions.delete(folder.id);
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
    let {expanded} = this.state;
    let {folder} = this.props;

    if (folder.id == nextProps.selectedFolderId || (
        typeof nextProps.selectedFoldersIDs !== 'undefined' &&
        (
          nextProps.selectedFoldersIDs.indexOf(folder.parent_id) >= 0
          || nextProps.selectedFoldersIDs.indexOf(folder.id) >= 0
        )
        || folder.parent_id == 8
      )) {
      expanded = true;
    } else {
      expanded = false;
    }
    this.setState({
      selectedFoldersIDs: nextProps.selectedFoldersIDs,
      selectedFolderId: nextProps.selectedFolderId,
      expanded: expanded

    });
  },

  toggleExpanded: function () {
    let {expanded} = this.state;
    expanded = !expanded;
    this.setState({
      expanded: expanded
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let childNodes = null;
    let playlistNodes = null;
    let {folder, playlists, selectedFolderId, selectedFoldersIDs}= this.props;
    let {expanded, showMenu, selected, dialogType} = this.state;
    let folderClassName = 'folder list-item';
    let folderHeaderClassName = 'header';
    let playlistForm;
    let children = [];
    let iconNode;
    let iconClassName;
    let menu = null;
    let folderForm = null;
    let OnePl;


    iconClassName = 'fa fa-caret-right';


    if (folder.children.length > 0) {
      children = folder.children.filter(function (folder) {
        return folder.deleted === false;
      });
    }


    if (typeof selectedFoldersIDs !== 'undefined' && typeof selectedFolderId !== 'undefined' &&
      (
        selectedFolderId == folder.id
        || selectedFoldersIDs.indexOf(folder.parent_id) >= 0
        || selectedFoldersIDs.indexOf(folder.id) >= 0
      )) {
      // if folder has childNodes
      if (children.length > 0 && expanded) {
        folderClassName += ' expanded';
        iconClassName = 'fa  fa-caret-down';
        // if folder has playlistNodes
        childNodes = children.map(function (value, index) {
          return (<div>
            <Folder
              selectedFoldersIDs={selectedFoldersIDs}
              key={value.id}
              selectedFolderId={selectedFolderId}
              playlists={playlists} folder={value}
              handleFolderItemClick={this.props.handleFolderItemClick}/>
          </div>)
        }, this);
      }

      if (playlists.length > 0) {
        if (selectedFolderId == folder.id) {
          folderClassName += ' expanded';
          iconClassName = 'fa  fa-caret-down';
        }

        playlistNodes = playlists.filter(function (playlist) {
          return playlist.deleted === false && playlist.folder_id == folder.id;
        }).map(function (playlist, index) {
          OnePl = playlist;
          return <PlaylistItem key={playlist.id} playlist={playlist} type="tree"/>
        }, this);
      }

    }

    iconNode = (<span className={iconClassName} style={{marginLeft: '13px'}}/>);

    if (showMenu === true) {

      menu = (
        <DropdownButton title={
          <span><i className="glyphicon glyphicon-option-vertical" /></span>
        } id="bg-nested-dropdown" className="edit-folder" noCaret={true}>
          <MenuItem eventKey="newFolderChildrenFolder" onSelect={this._onMenuSelect}>New Folder</MenuItem>
          <MenuItem eventKey="edit" onSelect={this._onMenuSelect}>Rename</MenuItem>
          <MenuItem divider="divider"/>
          <MenuItem eventKey="showNewActionDialogCreate" onSelect={this._onMenuSelect}>New playlist</MenuItem>
          <MenuItem eventKey="showNewActionDialogTemplate" onSelect={this._onMenuSelect}>New playlist fom
            template</MenuItem>
          <MenuItem divider="divider"/>
          <MenuItem eventKey="delete" onSelect={this._onMenuSelect}>Delete</MenuItem>
        </DropdownButton>
      );

      //<div className="toggle-menu" onClick={this._toggleMenu}>:</div>
    }

    if (this.state.showSettings === true) {
      folderForm = <FolderForm templateList={this.state.templateList} folder={folder}
                               action="update" show={true} onClose={this._closeSettings}/>
    }

    let newFolderForm = null;
    if (this.state.showNewFolderForm === true) {
      newFolderForm =
        <FolderForm newFolder={true} templateList={this.props.templateList} show={true} folder={folder}
                    onClose={this._closeNewFolderForm}
                    action="newFolderChildrenFolder" parentId={folder.id}/>
    }

    if (this.state.showNewTvizActionDialog === true) {
      playlistForm =
        <PlaylistForm dialogType={dialogType} templateList={this.props.templateList}
                      show={true}
                      action="create" folderId={folder.id} onClose={this._toggleNewActionDialog}/>
    }

    return (
      <div className={folderClassName}>
        <div className={folderHeaderClassName} onMouseEnter={this._showMenu} onMouseLeave={this._hideMenu}>
          <div className="icon" onClick={this._toggleExpanded}>{iconNode}</div>
          <div className="menu">
            {menu}
          </div>
          <div className="title" onClick={this._toggleExpanded}>{folder.title}</div>
        </div>
        <div className="children">
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