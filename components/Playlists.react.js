"use strict";
let React = require('react');
let Playlist = require('./Playlist.react');
let PlaylistsCount = require('./PlaylistsCount.react');
let TreeStore = require('../stores/TreeStore');

/**
 *
 */
let Playlists = React.createClass({
  PropTypes: {
    playlists: React.PropTypes.object
  },

  /**
   *
   * @returns {{playlists: Array, searchText: string}}
   */
  getInitialState: function () {
    return {
      playlists: [],
      searchText: ''
    };
  },

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      playlists: nextProps.playlists,
      searchText: ''
    });
  },

  /**
   *
   * @param e
   * @private
   */
  _handleSearchChange: function (e) {
    let searchText = e.target.value;
    let {playlists} =this.props;

    if (searchText.length < 1) {
      this.setState({
        searchText: searchText,
        playlists: playlists
      });
      return;
    }

    let regexp = new RegExp(searchText, 'gi');

    this.setState({
      searchText: searchText,
      playlists: playlists.filter(function (playlist) {
        return playlist.title.search(regexp) !== -1;
      })
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {playlists, title} = this.props;
    let {searchText} = this.state;
    let playlistNodes = playlists.map(function (playlist) {
      return (
        <Playlist key={playlist.id} playlist={playlist}/>
      );
    }, this);

    return (
      <div className="box playlists-box">
        <div className="box-header with-border">
          <h3 className="box-title">
            {title} (<PlaylistsCount data={playlists.length}/>)
          </h3>

          <div className="box-tools">
            <div className="box-search input-group input-group-sm">
              <input
                onChange={this._handleSearchChange}
                value={searchText}
                type="text"
                name="table_search"
                className="form-control pull-right"
                placeholder=""
              />

              <div className="input-group-btn">
                <button type="submit" className="btn btn-default">
                  <i className="fa fa-search"/>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="box-body">
          {playlistNodes}
        </div>
        <div className="box-footer">

        </div>
      </div>
    )
  }
});

/**
 *
 */
module.exports = Playlists;