"use strict";
let React = require('react');
let OnAirStore = require('../../stores/OnAirStore');
let PlaylistItem = require('../PlaylistItem.react');
let CatalogStore = require('../../stores/CatalogStore');
let OnAirActions = require('../../actions/OnAirActions');

/**
 *
 * @returns {{triangleName: string, triangleData: string, triangleType: string, playlists: (*|Array)}}
 */
function getOnAirStateState() {
  return {
    triangleName: 'up',
    triangleData: 'up',
    triangleType: 'up',
    playlists: OnAirStore.getPlayLists()
  }
}

let sortName = '';
let sortDate = '';
let sortStatus = '';
let sortType = '';

/**
 *
 */
let OnAir = React.createClass({
  state: {},
  /**
   *
   * @returns {{triangleName, triangleData, triangleType, playlists}|{triangleName: string, triangleData: string, triangleType: string, playlists: (*|Array)}}
   */
  getInitialState: function () {
    // let {catalogType} = this.props;
    OnAirStore.init(catalogType);
    return getOnAirStateState()
  },

  /**
   *
   */
  componentWillMount: function () {
    OnAirStore.addChangeListener(this._onChange);
  },
  
  /**
   *
   */
  componentDidMount: function () {
    this.props.setLastSearchText(OnAirStore.getLastSearch());
    CatalogStore.initSlimScroll('.catalog-box-table');
  },

  /**
   *
   */
  componentWillUnmount: function () {
    OnAirStore.removeChangeListener(this._onChange);
    $('.catalog-box-table').slimScroll({destroy: true});
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function () {
    this.setState(getOnAirStateState());
  },

  handleSortByName: function () {

  },

  handleSortByData: function () {

  },

  handelSortByType: function () {

  },

  getTriangleName: function () {

  },

  getTriangleType: function () {

  },

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
        sortStatus = '';
        sortName = '';
        sortType = '';
        break;
      case 'sortStatus':
        if (sortStatus == '') {
          sortStatus = 'up';
        }
        sortStatus = sortStatus == 'up' ? 'down' : 'up';
        sortDate = '';
        sortName = '';
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

    OnAirActions.sortEditList(sortBy);
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
        return <PlaylistItem key={playlist.id} playlist={playlist} type="onAir" selectedPlayList={selectedPlayList}/>
      }, this);
    }

    return (
    <div className="catalog-box">
      <table >
        <tbody >
        <tr className="th">
          <td className="t-name" onClick={this.handleSortCatalog.bind(this, 'sortName')}>Name <i className="ln"/>
            <i ref="sortName" className={sortName}/></td>
          <td className="t-data" onClick={this.handleSortCatalog.bind(this, 'sortDate')}>Date
            <i className="ln"/><i ref="sortDate" className={sortDate}/></td>
          <td className="t-type" onClick={this.handleSortCatalog.bind(this, 'sortType')}>Type
            <i ref="sortType" className={sortType}/></td>
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
module.exports = OnAir;