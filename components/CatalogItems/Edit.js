"use strict";
let React = require('react');
let EditStore = require('../../stores/EditStore');
let CatalogStore = require('../../stores/CatalogStore');
let PlaylistItem = require('../PlaylistItem.react');
let EditingActions = require('../../actions/EditingActions');

/**
 *
 * @returns {{playlists: (*|Array)}}
 */
function getEditingStateState() {
  return {
    playlists: EditStore.getPlayLists()

  }
}
/**
 *
 * @type {string}
 */
let sortType = '';
/**
 *
 * @type {string}
 */
let sortName = '';

/**
 *
 * @type {string}
 */
let sortDate = '';

/**
 *
 * @type {string}
 */
let sortStatus = '';
/**
 *
 */
let Edit = React.createClass({
  state: {},

  /**
   *
   * @returns {{playlists}}
   */
  getInitialState: function () {
    // let {catalogType} = this.props;
    EditStore.init(catalogType);

    return getEditingStateState()
  },

  /**
   *
   */
  componentWillMount: function () {
    EditStore.addChangeListener(this._onChange);
  },

  /**
   *
   */
  componentDidMount: function () {
    this.props.setLastSearchText(EditStore.getLastSearch());
    CatalogStore.initSlimScroll('.catalog-box-table');
  },

  /**
   *
   */
  componentWillUnmount: function () {
    EditStore.removeChangeListener(this._onChange);
    $('.catalog-box-table').slimScroll({destroy: true});
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function () {
    this.setState(getEditingStateState());
  },

  /**
   *
   * @param sortBy
   */
  handleSortCatalog: function (sortBy) {

    switch (sortBy) {
      case 'sortName':
        if (sortName == '') {
          sortName = 'up';
        }
        sortName = sortName == 'up' ? 'down' : 'up';
        sortDate = '';
        sortStatus = '';
        sortType = '';
        break;
      
      case 'sortDate':
        if (sortDate == '') {
          sortDate = 'up';
        }
        sortDate = sortDate == 'up' ? 'down' : 'up';
        sortName = '';
        sortStatus = '';
        sortType = '';
        break;
      
      case 'sortStatus':
        if (sortStatus == '') {
          sortStatus = 'up';
        }
        sortStatus = sortStatus == 'up' ? 'down' : 'up';
        sortName = '';
        sortDate = '';
        sortType = '';
        break;
      
      case 'sortType':
        if (sortType == '') {
          sortType = 'up';
        }
        sortType = sortType == 'up' ? 'down' : 'up';
        sortName = '';
        sortDate = '';
        sortStatus = '';
        break;
    }

    EditingActions.sortEditList(sortBy);
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {playlists} = this.state;
    let {selectedPlayList} = this.props;
    let playlistNodes = null;

    if (playlists.length > 0) {
      playlistNodes = playlists.filter(function (playlist) {
        return playlist.deleted === false;
      }).map(function (playlist) {
          return <PlaylistItem key={playlist.id} playlist={playlist} type="edit" selectedPlayList={selectedPlayList}/>

      }, this);
    }

    return (
      <div className="catalog-box">
        <table >
          <tbody >
          <tr className="th">
            <td className="t-name" onClick={this.handleSortCatalog.bind(this, 'sortName')}>Name <i className="ln"/>
              <i ref="sortName" className={sortName}/></td>
            <td className="t-data" onClick={this.handleSortCatalog.bind(this, 'sortDate')}>Data of change
              <i className="ln"/><i ref="sortDate" className={sortDate}/></td>
            <td className="t-status" onClick={this.handleSortCatalog.bind(this, 'sortStatus')}>Status
              <i className="ln"/><i ref="sortStatus" className={sortStatus}/></td>
            <td className="t-type" onClick={this.handleSortCatalog.bind(this, 'sortType')}>Type
              <i ref="sortStatus" className={sortType}/></td>
          </tr>
          </tbody>
        </table>
        <div className="catalog-box catalog-box-table">
          <table>
            <tbody>
            {playlistNodes}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

/**
 *
 */
module.exports = Edit;