"use strict";
let React = require('react');

/**
 *
 */
let PlaylistsCount = React.createClass({
  PropTypes: {
    data: React.PropTypes.string
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {data} = this.props;
    return (
      <span className="playlists-count">
        {data}
      </span>
    )
  }
});

module.exports = PlaylistsCount;