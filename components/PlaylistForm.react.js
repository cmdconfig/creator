"use strict";
let React = require('react');
let moment = require('moment');

let PlaylistActions = require('../actions/PlaylistActions');

let Modal = require('react-bootstrap/lib/Modal');
let Button = require('react-bootstrap/lib/Button');
let Form = require('react-bootstrap/lib/Form');
let FormGroup = require('react-bootstrap/lib/FormGroup');
let ControlLabel = require('react-bootstrap/lib/ControlLabel');
let FormControl = require('react-bootstrap/lib/FormControl');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let CatalogStore = require('../stores/CatalogStore');
let TreeStore = require('../stores/TreeStore');

/**
 *
 */
let PlaylistForm = React.createClass({
  PropTypes: {
    show: React.PropTypes.bool,
    playlist: React.PropTypes.object,
    playlistParent: React.PropTypes.object,
    calculateRating: React.PropTypes.bool,
    folderId: React.PropTypes.number
  },

  /**
   *
   * @returns {{show: *, playlist: *, playlistParent: *, calculateRating: boolean, folderId: *, published: boolean, isOnline: boolean, playListTypes: (*|Array), playlistType: undefined}}
   */
  getInitialState: function () {
    return {
      show: this.props.show,
      playlist: this.props.playlist,
      playlistParent: this.props.playlistParent,
      calculateRating: typeof this.props.playlist !== 'undefined' ? this.props.calculateRating : false,
      folderId: this.props.folderId,
      published: false,
      isOnline: false,
      playListTypes: CatalogStore.getPlayListTypes(),
      playlistType: undefined,
      dialogType: undefined,
      templates: TreeStore.getTemplateList(),
      templateSelected: undefined,
      temlateError: false,
      errorTitle: false
    }
  },

  /**
   *
   * @private
   */
  _close: function () {
    this.setState({show: false})
  },

  /**
   *
   * @private
   */
  _exited: function () {
    this.props.onClose();
  },

  /**
   *
   * @param field
   * @returns {*}
   * @private
   */
  _getValidationState: function (field) {
    let {playlist} = this.state;
    switch (field) {
      case 'title':
        if (typeof playlist !== 'undefined') {
          let value = playlist.title;
          if (typeof value !== 'undefined') {
            if (value.length < 1 || value.length > 64) {
              return 'error';
            }
            return 'success';
          }

        }
        return 'error';
    }
  },

  /**
   *
   * @param e
   * @private
   */
  _handleTitleChange: function (e) {
    let {playlist} = this.state;
    let newPlaylist = (typeof playlist !== 'undefined') ? playlist : {};
    newPlaylist.title = e.target.value;
    this.setState({
      playlist: newPlaylist
    });
  },

  /**
   *
   * @param e
   * @private
   */
  _handleCalculateRatingChange: function (e) {
    let {playlist, calculateRating} = this.state;
    let newPlaylist = undefined;
    if (typeof playlist !== 'undefined') {
      newPlaylist = playlist;
      newPlaylist.calculateRating = e.target.value;
    }

    this.setState({
      playlist: newPlaylist,
      calculateRating: !calculateRating
    });
  },

  /**
   *
   * @param e
   * @private
   */
  _handelPublishedChange: function (e) {
    let {playlist, published} = this.state;
    let newPlaylist = undefined;
    if (typeof playlist !== 'undefined') {
      newPlaylist = playlist;
      newPlaylist.published = e.target.value;
    }

    this.setState({
      playlist: newPlaylist,
      published: !published
    });
  },

  /**
   *
   * @param e
   * @private
   */
  _handelIsOnlineChange: function (e) {
    let {playlist, isOnline} = this.state;
    let newPlaylist = undefined;
    if (typeof playlist !== 'undefined') {
      newPlaylist = playlist;
      newPlaylist.isOnline = e.target.value;
    }

    this.setState({
      playlist: newPlaylist,
      isOnline: !isOnline
    });
  },

  /**
   *
   * @param dateTime
   * @private
   */
  _handleStartedChange: function (dateTime) {
    let {playlist} = this.state;
    let newPlaylist = playlist;
    newPlaylist.dt_start = dateTime;

    this.setState({
      playlist: newPlaylist
    });
  },

  /**
   *
   * @param dateTime
   * @private
   */
  _handleFinishedChange: function (dateTime) {
    let {playlist} = this.state;
    let newPlaylist = playlist;
    newPlaylist.dt_stop = dateTime;

    this.setState({
      playlist: newPlaylist
    });
  },

  /**
   *
   * @param e
   * @private
   */
  _update: function (e) {
    let {playlist} = this.state;
    PlaylistActions.update(playlist);
  },

  /**
   *
   * @param e
   * @private
   */
  _create: function (e) {
    let {dialogType} = this.props;
    let {playlist, folderId, templateSelected} = this.state;

    if(dialogType == 'template' && typeof templateSelected === 'undefined') {
      this.setState({temlateError: true});
      return true;
    }
    this.setState({temlateError: false});
    PlaylistActions.create(playlist, folderId, typeof templateSelected !== 'undefined' ? templateSelected.id : undefined);
    return false;
  },

  /**
   *
   * @param e
   * @private
   */
  _createChildren: function (e) {
    let {playlist,  playlistType} = this.state;
    let { selectedPlayList} = this.props;
    PlaylistActions.createChildren(playlist, selectedPlayList, playlistType);
  },

  /**
   *
   * @param e
   * @private
   */
  _submit: function (e) {
    let {action} = this.props;
    let {playlist} = this.state;



    if (/^[0-9]{5}$/.test(playlist.title) || playlist.title.length <= 3){
      this.setState({
        errorTitle: true
      });
      return null;
    }

    this.setState({
      errorTitle: false
    });

    let error = false;

    switch (action) {
      case 'update':
        error = this._update(e);
        break;
      case 'create':
        error = this._create(e);
        break;
      case 'createChildren':
        error = this._createChildren(e);
        break;
    }

    if(!error){
      this._close();
    }
  },

  /**
   *
   * @param eventKey
   * @private
   */
  _handleTemplateChange: function (eventKey) {
    let {action} = this.props;
    let {playlist} = this.state;

    switch (action) {
      case 'update':
      case 'create':
        let newPlayList = playlist;
        if (typeof newPlayList === 'undefined') {
          newPlayList = {plType: parseInt(eventKey.key)}
        } else {
          newPlayList.plType = parseInt(eventKey.key)
        }
        this.setState({
          playlist: newPlayList,
          templateSelected: eventKey
        });
        break;
      case 'createChildren':
        this.setState({
          playlistType: parseInt(eventKey.key)
        });
        break;
    }
  },

  componentWillReceiveProps: function (nextProp) {
    this.setState({
      selectedPlayList: nextProp.selectedPlayList    
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    const defaultTitle = 'Template';

    let {playlist,show, templateSelected, temlateError, errorTitle} = this.state;
    let {dialogType, templateList} = this.props;
    let title = typeof templateSelected === 'undefined' ? defaultTitle : templateSelected.main_title;
    let menuItem = [];

    if (title.length > defaultTitle.length) {
      // title = title.substr(0, templateSelected.title.length - 3) + '...';
      let tmpTitle = title.substr(0, 13) + '...';

      title = tmpTitle + title.substr(tmpTitle.length+4, templateSelected.title.length)
    }

     if(typeof templateList !== 'undefined') {
      menuItem = templateList.map(function (tpl) {
        if(tpl.deleted === false && typeof tpl.parent_play_list === 'undefined') {
          return <MenuItem eventKey={tpl} prop={tpl}>{tpl.main_title}</MenuItem>
        }
      });
    }

    let temlateErrorStyle = null;
    if(temlateError){
      temlateErrorStyle = {border: '1px solid red'}
    }

    let error = errorTitle ? {borderColor: 'red'} : null;
    return (
      <Modal show={show} onHide={this._close} onExited={this._exited}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать Плейлист прямого эфира</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this._submit}>
            <FormGroup controlId="formPlaylistTitle" validationState={this._getValidationState("title")}>
              <ControlLabel>Name of a Series/Release/Program/Event</ControlLabel>
              <FormControl
                style={error}
                type="Name of a Series/Release/Program/Event"
                placeholder=""
                onChange={this._handleTitleChange}
                value={(typeof playlist !== 'undefined') ? playlist.title : ''}
              />
              {dialogType == 'template' ?
                <ButtonToolbar>
                  <DropdownButton onSelect={this._handleTemplateChange} controlId="formFolderTemplate" title={title}
                                  id="dropdown-size-medium" style={temlateErrorStyle}>
                    {menuItem}
                  </DropdownButton>
                </ButtonToolbar>
                : null
              }

            </FormGroup>            
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._close}>Cancel</Button>
          <Button onClick={this._submit} bsStyle="primary">Ok</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/**
 *
 */
module.exports = PlaylistForm;