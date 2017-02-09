"use strict";
let React = require('react');
let PlayListLink = require('./PlayListLink.react');

/**
 *
 */
let PlaylistChildren = React.createClass({
  PropTypes: {
    playlist: React.PropTypes.object
  },

  /**
   *
   * @returns {XML}
   */
  render() {
    let {playlist} = this.props;
    return (
      <div>
        <PlayListLink playlist={playlist}/>
        {/**
         <i className="fa  fa-play" onClick={this._onTogglePublish}></i>
         <i className="fa fa-trash" onClick={this._onDelete}></i>
         <i className="fa fa-clone" onClick={this._onClone}></i>
         <i className="fa fa-gears" onClick={this._showSettings}></i>

         */}
        <hr />
      </div>
    )
  }
});

/**
 *
 */
module.exports = PlaylistChildren;