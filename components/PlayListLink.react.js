"use strict";
let React = require('react');

/**
 *
 */
let PlayListLink = React.createClass({
  PropTypes: {
    palylist: React.PropTypes.object
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {playlist} = this.props;
    let hrefStyle = {
      color: 'black',
      cursor: 'pointer'
    };
    let published = playlist.published ? 'Air' : '';
    let editPlayList = playlist.published ?
      <a href={Routing.generate("online_v2",{'id':playlist.id})} target="_blank"
         style={hrefStyle}>{playlist.title} {published}</a>
      :
      <a href={Routing.generate("playlist_v2",{'id':playlist.id})} target="_blank"
         style={hrefStyle}>{playlist.title}</a>;

    return (
      <div>
        {editPlayList}
      </div>
    );
  }
});

/**
 *
 */
module.exports = PlayListLink;