"use strict";
let React = require('react');
let TemplateStore = require('../../stores/TemplateStore');
let PlaylistItem = require('../PlaylistItem.react');
let CatalogStore = require('../../stores/CatalogStore');
let TemplateAction = require('../../actions/TemplateAction');

/**
 *
 * @returns {{playlists: (*|Array)}}
 */
function getTemplateStateState() {
  return {
    playlists: TemplateStore.getPlayLists()
  }
}

let sortName = '';
let sortPath = '';
let sortType = '';


/**
 *
 */
let Templates = React.createClass({
  state: {},
  /**
   *
   * @returns {{playlists}|{playlists: (*|Array)}}
   */
  getInitialState: function () {
    // let {catalogType} = this.props;
    TemplateStore.init(catalogType);
    return getTemplateStateState()
  },

  /**
   *
   */
  componentDidMount: function () {
    this.props.setLastSearchText(TemplateStore.getLastSearch());
    CatalogStore.initSlimScroll('.catalog-box-table');
  },

  /**
   *
   */
  componentWillMount: function () {
    TemplateStore.addChangeListener(this._onChange);
  },

  /**
   *
   */
  componentWillUnmount: function () {
    TemplateStore.removeChangeListener(this._onChange);
    $('.catalog-box-table').slimScroll({destroy: true});
  },

  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function () {
    this.setState(getTemplateStateState());
  },

  handleSortCatalog: function (sortBy) {

    switch (sortBy) {
      case 'sortName':
        if (sortName == '') {
          sortName = 'up';
        }
        sortName = sortName == 'up' ? 'down' : 'up';
        sortPath = '';
        sortType = '';
        break;
      case 'sortPath':
        if (sortPath == '') {
          sortPath = 'up';
        }
        sortPath = sortPath == 'up' ? 'down' : 'up';
        sortName = '';
        sortType = '';
        break;
      case 'sortType':
        if (sortType == '') {
          sortType = 'up';
        }
        sortType = sortType == 'up' ? 'down' : 'up';
        sortName = '';
        sortPath = '';      
        break;
     
    }

    TemplateAction.sortEditList(sortBy);
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
        return <PlaylistItem key={playlist.id} playlist={playlist} type="template" selectedPlayList={selectedPlayList}/>
      }, this);
    }

    return (

    <div className="catalog-box">
      <table >
        <tbody >
        <tr className="th">
          <td className="t-name" onClick={this.handleSortCatalog.bind(this, 'sortName')}>Name <i className="ln"/>
            <i ref="sortName" className={sortName}/></td>
          <td className="t-path" onClick={this.handleSortCatalog.bind(this, 'sortPath')}>Name of Serial 
            <i className="ln"/><i ref="sortDate" className={sortPath}/></td>          
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
module.exports = Templates;