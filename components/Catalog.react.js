"use strict";
let React = require('react');
const enhanceWithClickOutside = require('react-click-outside');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let Tree = require('./CatalogItems/Tree');
let Edit = require('./CatalogItems/Edit');
let OnAir = require('./CatalogItems/OnAir');
let Templates = require('./CatalogItems/Templates');
let PlayListEdit = require('./PlayListItems/PlayListEdit');
let CatalogStore = require('../stores/CatalogStore');
let CatalogActions = require('../actions/CatalogActions');
let PlaylistForm = require('./PlaylistForm.react');
let TreeActions = require('../actions/TreeActions');
let PlaylistActions = require('../actions/PlaylistActions');
let TreeStore = require('../stores/TreeStore');

let EditingActions = require('../actions/EditingActions');
let EditStore = require('../stores/EditStore');

let OnAirActions = require('../actions/OnAirActions');
let OnAirStore = require('../stores/OnAirStore');

let TemplateAction = require('../actions/TemplateAction');
let TemplateStore = require('../stores/TemplateStore');

let LocalStorageMixin = require('react-localstorage');
// let CollapsibleMixin = require('react-collapsible-mixin');
/**
 *
 * @type {{Tree: string, Templates: string, OnAir: string, Editing: string}}
 */
let filterItems = {
  Tree: 'Tree',
  Templates: 'Templates',
  OnAir: 'On Air',
  Editing: 'Editing'
};

/**
 *
 * @returns {{filterItemsSelected: number}}
 */
function getCatalogState() {

  let selectedFoldersIdArr = CatalogStore.getSelectedFoldersIdArr();

  return {
    filterItemsSelected: 1,
    selectedPlayList: CatalogStore.getSelectedPlayList(),  
    catalogType: CatalogStore.getCatalogType(),
    lastSearch: '',
    showFaX:false,
    selectedFoldersIdArr:  CatalogStore.getSelectedFoldersIdArr()

  }
}

function getLocalStorageKey(component) {
  if (component.getLocalStorageKey) return component.getLocalStorageKey();
  if (component.props.localStorageKey === false) return false;
  if (typeof component.props.localStorageKey === 'function') return component.props.localStorageKey.call(component);
  return component.props.localStorageKey || getDisplayName(component) || 'react-localstorage';
}

/**
 *
 */
var Catalog = React.createClass({

  displayName: 'Catalog_',

  mixins: [LocalStorageMixin],

  // statics: {
    addMediaTvizs(tvizs){

      return CatalogActions.createMediaTemplates(TreeStore.getSelectedFolder(), tvizs);
    },

  deleteMediaTvizs(tvizs){
    // console.log('deleteMediaTvizs', tvizs);
    return TreeActions.deleteMediaTemplates(TreeStore.getSelectedFolder(), tvizs);
  },
  // },

  // statics: {
  handleCreateTemplate: function () {
    let playlist = CatalogStore.getSelectedPlayList();
    EditingActions.createTemplate(playlist.id);
    // }
  },
  /**
   *
   * @returns {{filterItemsSelected}}
   */
  getInitialState: function () {
    // let {getCatalogState} = this.state;
    // this.setState({
    //   getCatalogState:getCatalogState
    // });
    return getCatalogState();
  },

  /**
   *let selectedFoldersIdArr = CatalogStore.getSelectedFoldersIdArr()
   */
  componentWillMount: function () {
    this.displayName = 'Catalog_' + catalogType;
    CatalogStore.addChangeListener(this._onChange);
  },

  /**
   *
   */
  componentWillUnmount: function () {
    CatalogStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function () {

    setTimeout(function () {
      let {selectedPlayList} =  this.state;
      if (selectedPlayList) {
        edit_playlist(selectedPlayList, this.callbackPlayListAction);
      }
    }.bind(this), 1000);
  },

  setLastSearchText: function (lastSearch) {
    this.setState({lastSearch: lastSearch});
  },
  /**
   * Event handler for 'change' events coming from the TodoStore
   */
  _onChange: function () {
    let {selectedPlayList, selectedFoldersIdArr} =  this.state;
    if (selectedPlayList != CatalogStore.getSelectedPlayList()) {
      edit_playlist(CatalogStore.getSelectedPlayList(), this.callbackPlayListAction);
    }

    let _selectedFoldersIdArr = CatalogStore.getSelectedFoldersIdArr();
    if(typeof selectedPlayList !== 'undefined') {
      // CatalogActions.setSelectedFolderIDsArr(selectedPlayList.folder_id, selectedFoldersIdArr);

      _selectedFoldersIdArr.push(selectedPlayList.folder_id)
    }


    // let _selectedFoldersIdArr = CatalogStore.getSelectedFoldersIdArr();

    this.setState({
      selectedPlayList: CatalogStore.getSelectedPlayList(),
      selectedFoldersIdArr: typeof _selectedFoldersIdArr !== 'undefined' ? _selectedFoldersIdArr : [],
      showAddPlayList: CatalogStore.getShowAddPlayList()
    });
  },

  callbackPlayListAction: function (action, data) {
    let {selectedPlayList} = this.state;

    switch (action) {
      case 'ad_edit':
      case 'edit':
      case 'update':
        PlaylistActions.update(data);
        break;

      case 'delete':
        this.setState({
          selectedPlayList: undefined
        });
        PlaylistActions.delete(selectedPlayList);
        break;
    }
  },

  /**
   *
   * @param eventKey
   */
  handlePlayListInFoldersFilterTypeChange: function (eventKey) {
    CatalogActions.setSelectedCatalogType(eventKey.target.value);
    this.setState({
      // filterItemsSelected: eventKey.filterItems
      filterItemsSelected: eventKey.target.value
    });
  },

  handleSelectPlayList: function (playlist) {
    this.setState({
      selectedPlayList: playlist
    });
  },

  closePlayListDialog: function () {
    CatalogActions.addPlayListDialog(false);
  },

  handleDeletePlayList: function () {

  },

  handleSearch: function () {
    let searchText = this.refs.tableSearch.value;
    let {filterItemsSelected} =  this.state;

    let showFaX = function () {
      return searchText == '';
    };

    this.setState({
      lastSearch: searchText,
      showFaX: showFaX
    });

    switch (filterItemsSelected) {
      case 'Editing':
        EditingActions.search(searchText);
        break;

      case 'On Air':
        OnAirActions.search(searchText);
        break;

      case 'Templates':
        TemplateAction.search(searchText);
        break;

      default:
        TreeActions.search(searchText);
        break;
    }
  },

  handleFaXClick: function () {
    let {filterItemsSelected} =  this.state;

    switch (filterItemsSelected) {
      case 'Editing':
        EditingActions.search('');
        break;

      case 'On Air':
        OnAirActions.search('');
        break;

      case 'Templates':
        TemplateAction.search('');
        break;

      default:
        TreeActions.search('');
        break;
    }
    this.setState({
      lastSearch: '',
      showFaX: false
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {filterItemsSelected, selectedPlayList, showAddPlayList, catalogType, lastSearch, selectedFoldersIdArr, showFaX} =  this.state;
    let menuItem = [];
    let screenData;
    let templatesSelected = '';
    let onAirSelected = '';
    let editingSelected = '';
    let treeSelected = '';

    switch (filterItemsSelected) {
      case 'Templates':
        templatesSelected = 'selected';
        screenData = <Templates catalogType={catalogType} setLastSearchText={this.setLastSearchText} selectedPlayList={selectedPlayList}/>;
        break;
      case 'On Air':
        onAirSelected = 'selected';
        screenData = <OnAir catalogType={catalogType} setLastSearchText={this.setLastSearchText} selectedPlayList={selectedPlayList}/>;
        break;
      case 'Editing':
        editingSelected = 'selected';
        screenData = <Edit catalogType={catalogType} setLastSearchText={this.setLastSearchText} selectedPlayList={selectedPlayList}/>;
        break;
      default:
        treeSelected = 'selected';
        screenData = <Tree 
          catalogType={catalogType} 
          setLastSearchText={this.setLastSearchText} 
          selectedFoldersIdArr={selectedFoldersIdArr}
          selectedPlayList={selectedPlayList}

        />;
    }

    for (let key in filterItems) {
      menuItem.push(<MenuItem key={key} eventKey={{filterItems:key}}>{filterItems[key]}</MenuItem>)
    }

    let playlistForm = null;
    if (showAddPlayList) {
      playlistForm = <PlaylistForm show={true} selectedPlayList={selectedPlayList} onClose={this.closePlayListDialog}
                                   action="createChildren"/>
    }

    let faX = {display: 'none'};
    if(showFaX){
      faX = {display: 'block'};
    }

    let showTemplateCase = null;
    if(catalogType != 'advertising') {
      showTemplateCase = <option selected={templatesSelected}  value="Templates">Templates</option>;
    }

    return (
      <div className="datareactroot">
        <div className="tiiles">
          <h4 className="box-title">Catalogue</h4>
          <div className="box-select">
            <select onChange={this.handlePlayListInFoldersFilterTypeChange}>
              <option selected={treeSelected}  value="Tree">Tree</option>
              {showTemplateCase}
              <option selected={onAirSelected} value="On Air">On Air</option>
              <option selected={editingSelected} value="Editing">Editing</option>
            </select>
          </div>
          <div className="box-search">
            <i className="fa-search"/>
            <i className="fa-X" style={faX} onClick={this.handleFaXClick}/>
            <input type="text" name="table_search" value={lastSearch} className="form-control pull-right"
                   onChange={this.handleSearch} ref="tableSearch"/>
          </div>
        </div>
        {screenData}

        {playlistForm}
      </div>
    )
  }
});

module.exports = Catalog;