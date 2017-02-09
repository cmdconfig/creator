"use strict";
let React = require('react');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let PlaylistActions = require('../actions/PlaylistActions');
let PlaylistForm = require('./PlaylistForm.react');
let moment = require('moment');
let CatalogActions = require('../actions/CatalogActions');
let TreeActions = require('../actions/TreeActions');
let CatalogStore = require('../stores/CatalogStore');

let PlayListEditItem = React.createClass({
  render : function () {
    let {playlist, selectedDiv, plTitle, catalogType, plTypes, onClick, onMouseEnter} = this.props;
    let dateTime = moment(playlist.updated).format('DD-MM, HH:mm');
    return (
      <tr key={playlist}
        className={selectedDiv}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
      >
        <td className="t-name">{plTitle} <span/></td>
        <td className="t-data"> {dateTime}</td>
        <td className="t-status status">{catalogType}</td>
        <td className="t-type type">{plTypes}</td>
      </tr>
    );
  }
});

let PlayListTemplateItem = React.createClass({
  render: function () {
    let {playlist, selectedDiv, plTitle, plTypes, onClick, onMouseEnter} = this.props;
    let plData = <span>{playlist.play_list_path}</span>;
    let finishedClass = 't-name';
    if(typeof playlist.pl_type !== 'undefined' && playlist.pl_type == 5){
      finishedClass += ' finished-playlist50'
    }
    return (
      <tr key={playlist.id} onClick={onClick} className={selectedDiv}
          onMouseEnter={onMouseEnter}>
        <td className={finishedClass}>{plTitle} <span/></td>
        <td className="t-path"> {plData}</td>
        <td className="t-type type">{plTypes}</td>
      </tr>
    );
  }
});

let PlayListDefaultItem = React.createClass({
  render: function () {
    let {folderClassName, playlist, onClick, selectedItemHover, selectedDiv, folderHeaderClassName,
      onMouseEnter, onMouseLeave, } = this.props;
    return(
      <div className={folderClassName} key={playlist.id} onClick={onClick}>
        <div className={selectedItemHover}></div>
        <div className={selectedDiv}></div>
        <div className={folderHeaderClassName} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          {this.props.children}
        </div>
        <br style={{clear: 'both'}}/>
      </div>
    );
  }
});

let PlayListDefaultItemIn = React.createClass({
  render: function () {
    let {plTitle, catalogType, onClick, onMouseEnter, plType, plData} = this.props;
    return(
      <div className="playlist-title" onClick={onClick} onMouseEnter={onMouseEnter}
           onMouseLeave={this.handleMouseLeave}>
        {plTitle} {catalogType}

        {plType} {plData}
        <br style={{clear: 'both'}}/>
      </div>
    )
  }
});

let PlayListOnAirItem = React.createClass({
  render: function () {
    let {playlist, onClick, selectedDiv, onMouseEnter, plTitle, plTypes} = this.props;
    // let dateTime = moment(playlist.updated).format('DD-MM, HH:mm'); With Karpov
    let dateTime =
      (typeof playlist.started !== 'undefined' ? moment(playlist.started).format('dd, DD.MM, HH:mm') : '?') +
        '-' +
      (typeof playlist.finished !== 'undefined' ? moment(playlist.finished).format('HH:mm') : '?');
    return(
      <tr key={playlist.id} onClick={onClick} className={selectedDiv}
          onMouseEnter={onMouseEnter}>
        <td className="t-name">{plTitle} <span/></td>
        <td className="t-data"> {dateTime}</td>
        <td className="t-type type">{plTypes}</td>
      </tr>
    )
  }
});

/**
 *
 */
let PlaylistItem = React.createClass({

  /**
   *
   * @returns {{showMenu: boolean, showSettings: boolean, showTvizActionDialog: boolean}}
   */
  getInitialState: function () {
    return {
      showMenu: false,
      showSettings: false,
      showTvizActionDialog: false,
      expanded: false,
      selectedPlayList: CatalogStore.getSelectedPlayList(),
      playListTypes: CatalogStore.getPlayListTypes(),
      lineHover: false
    }
  },

  /**
   *
   */
  handleClick: function () {

  },

  /**
   *
   * @private
   */
  _toggleMenu: function () {
    let showMenu = !this.state.showMenu;
    this.setState({showMenu: showMenu})
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
    playlist.published = !playlist.published;
    PlaylistActions.update(playlist);
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

  setSelectedPlayList: function () {
    let {expanded} = this.state;
    let {playlist, type} = this.props;

    if(type == 'tree') {
      // TreeActions.clearSelectedFoldersIDs(playlist)
    }

    CatalogActions.setSelectedPlayList(playlist);


    this.setState({
      // expanded: !expanded
    });
  },

  openAddPlayListDialog: function () {
    CatalogActions.addPlayListDialog(true);
  },

  handleMouseEnter: function () {
    this.setState({lineHover: true})
  },

  handleMouseLeave: function () {
    this.setState({lineHover: false})
  },

  render: function () {
    let {playlist, type, selectedPlayList} = this.props;
    let {lineHover} = this.state;
    let circle = {};
    let plData = null;
    let plType = null;
    let folderClassName = 'folder list-item';
    let folderHeaderClassName = 'header';
    let dateTimeStart = undefined;
    let selectedDiv = '';

    let plTypes = null;
    if (typeof selectedPlayList !== 'undefined') {
      if (playlist.id == selectedPlayList.id) {
        selectedDiv = 'selected';
      }
    }

    if (playlist.deleted || typeof playlist.parent_play_list !== 'undefined') {
      return null;
    }

    if (typeof playlist.catalog_type !== 'undefined' && type != 'onAir') {

      switch (parseInt(playlist.catalog_type)) {
        case 1:
          circle = 'edit';
          break;
        case 2:
          circle = 'waiting';
          break;
        case 3:
          circle = 'approved';
          break;
        case 4:
          circle = 'air';
          break;
        case 5:
          circle = 'finished';
          break;
        case 6:
          circle = 'template';
          break;
      }
    }

    switch (playlist.pl_type) {
      case 1:
        plTypes = <i className="i_acr"/>;
        break;
      case 6:
        break;
      default :
        plTypes = <i className="i_time"/>;
    }

    let catalogType = <i className={circle}/>;

    if (playlist.repeat.length > 0) {
      let now = moment();
      playlist.repeat.map(function (rep) {
        // if (now >= moment(rep.date_start)) {
          dateTimeStart = moment(rep.date_start).format('DD-MM, HH:mm');
        // }
      });
    }

    if (typeof playlist.catalog_type !== 'undefined' && (type == 'onAir' || type == 'edit')) {
      plData = <span>{dateTimeStart}</span>;
    }

    let plTitle = typeof playlist.main_title === 'undefined' ? playlist.title : playlist.main_title;

    if (plTitle.length > 20) {

      // plTitle = plTitle.substr(0, 20) + '...'


      let tmpTitle = plTitle.substr(0, 13) + '...';

      plTitle = tmpTitle + plTitle.substr(tmpTitle.length + 4, tmpTitle.length)
    }

    let selectedItemHover = '';

    if (lineHover) {
      selectedItemHover = 'selectedItemHover';
    }

    let template = null;

      switch (type) {
        case 'edit':
          template = <PlayListEditItem
            onClick={this.setSelectedPlayList}
            onMouseEnter={this.handleMouseEnter}
            playlist={playlist}
            selectedDiv={selectedDiv}
            plTitle={plTitle}
            catalogType={catalogType}
            plTypes={plTypes}
          />;
          break;

        case 'onAir':
          template = <PlayListOnAirItem
            playlist={playlist}
            onClick={this.setSelectedPlayList}
            selectedDiv={selectedDiv}
            onMouseEnter={this.handleMouseEnter}
            plTitle={plTitle}
            plTypes={plTypes}
          />;
          break;

        case 'template':
          template = <PlayListTemplateItem
            onClick={this.setSelectedPlayList}
            onMouseEnter={this.handleMouseEnter}
            playlist={playlist}
            selectedDiv={selectedDiv}
            plTitle={plTitle}
            plTypes={plTypes}
          />;
          break;

        default:
          template = <PlayListDefaultItem
            folderClassName={folderClassName}
            playlist={playlist}
            onClick={this.setSelectedPlayList}
            selectedItemHover={selectedItemHover}
            selectedDiv={selectedDiv}
            folderHeaderClassName={folderHeaderClassName}
            onMouseEnter={this._showMenu}
            onMouseLeave={this._hideMenu}>

              <PlayListDefaultItemIn
                onClick={this._toggleMenu}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                plTitle={plTitle}
                catalogType={catalogType}
                plType={plType}
                plData={plData}/>

            </PlayListDefaultItem>;
          break;
      }

    return (
      template
    )
  }
});

/**
 *
 */
module.exports = PlaylistItem;