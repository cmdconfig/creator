"use strict";
let React = require('react');
let PlaylistActions = require('../actions/PlaylistActions');
let PlaylistForm = require('./PlaylistForm.react');
let PlayListLink = require('./PlayListLink.react');
let PlaylistChildren = require('./PlaylistChildren.react');

/**
 *
 */
let Playlist = React.createClass({
  PropTypes: {
    playlist: React.PropTypes.object
  },

  /**
   *
   * @returns {{showSettings: boolean, playlist: *, showNewTvizActionDialog: boolean}}
   */
  getInitialState: function () {
    return {
      showSettings: false,
      playlist: this.props.playlist,
      showNewTvizActionDialog: false
    }
  },

  /**
   *
   * @private
   */
  _showSettings: function () {
    this.setState({showSettings: true});
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
   * @private
   */
  _onTogglePublish: function () {
    let {playlist} = this.props;
    let playlistNew = playlist;
    playlist.published = !playlistNew.published;
    PlaylistActions.update(playlistNew);
  },

  /**
   *
   * @private
   */
  _onDelete: function () {
    let {playlist} = this.props;
    PlaylistActions.delete(playlist.id);
  },

  /**
   *
   * @private
   */
  _onClone: function () {
    let {playlist} = this.props;
    PlaylistActions.clone(playlist.id);
  },

  /**
   *
   * @private
   */
  _onAddChildren: function () {
    this.setState({
      showNewTvizActionDialog: true
    });
  },

  /**
   *
   * @private
   */
  _toggleNewActionDialog: function () {
    this.setState({
      showNewTvizActionDialog: false
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let playlistForm = null;
    let {playlist, showSettings, showNewTvizActionDialog} = this.state;
    let startDate = '';
    let playIcon = `fa fa-play`;
    let childrenPlayList;
    let editPlayList = <PlayListLink playlist={playlist}/>;

    if (showSettings === true) {
      playlistForm = <PlaylistForm playlist={playlist} show={true} onClose={this._closeSettings} action="update"/>
    }

    if (typeof playlist.started !== 'undefined') {
      let started = new Date(playlist.started);

      if (started instanceof Date) {
        startDate = '' +
          started.getDate() + '.' +
          (parseInt(started.getMonth()) + 1) + '.' +
          started.getFullYear() + ' ' +
          started.getHours() + ':' +
          started.getMinutes();
      }
    }

    if (typeof playlist.children_play_list !== 'undefined' && playlist.children_play_list.length > 0) {
      childrenPlayList = playlist.children_play_list.map(function (child) {
        return <PlaylistChildren playlist={child}/>;
      })
    }

    if (showNewTvizActionDialog === true) {
      playlistForm =
        <PlaylistForm show={true} action="createChildren" folderId={playlist.folder_id}
                      onClose={this._toggleNewActionDialog} playlistParent={playlist}/>
    }

    return (
      <div className="playlist">
        <div className="header">
          <div className="title">
            {editPlayList}
          </div>
        </div>
        <div className="body">
          <span className="start-date">{startDate}</span>

          <button id="bg-nested-dropdown" role="button" className="dropdown-toggle btn btn-default"
                   type="button">
            <span onClick="{this.handelPlusClick}">Add New Folder (Serial)</span>
          </button>

          <i className={playIcon} onClick={this._onTogglePublish}/>
          <i className="fa fa-trash" onClick={this._onDelete}/>
          <i className="fa fa-clone" onClick={this._onClone}/>
          <i className="fa fa-gears" onClick={this._showSettings}/>
        </div>

        {playlistForm}
        {childrenPlayList}

      </div>
    )
  }
});

/**
 *
 */
module.exports = Playlist;