"use strict";
let React = require('react');
let moment = require('moment');
let FolderActions = require('../actions/FolderActions');
let Modal = require('react-bootstrap/lib/Modal');
let Button = require('react-bootstrap/lib/Button');
let Form = require('react-bootstrap/lib/Form');
let FormGroup = require('react-bootstrap/lib/FormGroup');
let ControlLabel = require('react-bootstrap/lib/ControlLabel');
let FormControl = require('react-bootstrap/lib/FormControl');
let Input = require('react-bootstrap/lib/Input');
let DropdownButton = require('react-bootstrap/lib/DropdownButton');
let ButtonToolbar = require('react-bootstrap/lib/ButtonToolbar');
let MenuItem = require('react-bootstrap/lib/MenuItem');
let TreeStore = require('../stores/TreeStore');

/**
 *
 */
let FolderForm = React.createClass({
  PropTypes: {
    folder: React.PropTypes.object
  },

  /**
   *
   * @returns {{folder: {title: string}}}
   */
  getDefaultProps: function () {
    return {
      folder: {
        title: ''
      }
    }
  },

  /**
   *
   * @returns {{show: *, folder: *, templateList: (*|Array)}}
   */
  getInitialState: function () {
    return {
      show: this.props.show,
      folder: this.props.folder,
      templateList: TreeStore.getTemplateList(),
      liveProgram: undefined,
      errorTitle: false
    }
  },

  /**
   *
   * @private
   */
  _close: function () {
    this.setState({show: false})
  },

  /**
   *
   * @private
   */
  _exited: function () {
    this.props.onClose();
  },

  /**
   *
   * @param field
   * @returns {*}
   * @private
   */
  _getValidationState: function (field) {
    let {folder} = this.state;
    switch (field) {
      case 'title':
        let value = folder.title;
        if (value.length < 1 || value.length > 64) {
          return 'error';
        }
        return 'success';
    }
  },

  /**
   *
   * @param e
   * @private
   */
  _handleTitleChange: function (e) {
    let {folder} = this.state;
    this.setState({
      folder: Object.assign({}, folder, {title: e.target.value})
    });
  },

  /**
   *
   * @param e
   * @private
   */
  _submit: function (e) {
    let {folder, liveProgram} = this.state;
    let {parentId} = this.props;

  
    if(typeof liveProgram !== 'undefined'){
      folder.liveProgram = liveProgram;
      this.setState({
        folder: folder
      });
    } else {
      liveProgram = folder.live_program
    }

    if (/^[0-9]{5}$/.test(folder.title) || folder.title.length <= 3){
      this.setState({
        errorTitle: true
      });
      return null;
    }

    this.setState({
      errorTitle: false
    });

    switch (this.props.action) {
      case 'update':
        FolderActions.update(folder);
        break;
      case 'create':


        FolderActions.create(folder);
        break;
      case 'newFolderChildrenFolder':
        FolderActions.createChildrenFolder(parentId, folder, liveProgram);
        break;
    }
    this._close();
  },

  /**
   *
   * @param eventKey
   * @private
   */
  _handleTemplateChange: function (eventKey) {
    let {folder} = this.state;

    let newFolder = folder;
    newFolder.template = {id: eventKey.id, title: eventKey.title};
    this.setState({
      templateChange: true,
      folder: newFolder
    });
  },

  handleLiveProgram: function (state) {
    this.setState({
      liveProgram: state
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {folder, templateList, show, liveProgram, title, errorTitle} = this.state;
    let {newFolder, action} = this.props;

    // let menuItem = templateList.map(function (tpl) {
    //   return <MenuItem eventKey={{id:tpl.id,title:tpl.title}}>{tpl.title}</MenuItem>
    // });

    let liveProgramYES = ``;
    let liveProgramNO = ``;

    if (typeof folder.live_program !== 'undefined') {
      if(typeof liveProgram === 'undefined'){
         liveProgram = folder.live_program;
      }


      if (folder.live_program) {
        liveProgramYES = `checked`;
      }

      if (!folder.live_program) {
        liveProgramNO = `checked`;
      }
    }
    if(typeof liveProgram === 'undefined'){
      liveProgram = false;
    }


    if (typeof liveProgram !== 'undefined') {
      liveProgramYES = ``;
      liveProgramNO = ``;

      if (liveProgram) {
        liveProgramYES = `checked`;
      }

      if (!liveProgram) {
        liveProgramNO = `checked`;
      }
    }

    let titleInput = '';
    if (!newFolder) {
      titleInput = folder.title;
    } else {
      titleInput = title;
    }

    let error = errorTitle ? {borderColor: 'red'} : null;

    return (
      <Modal show={show} onHide={this._close} onExited={this._exited}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this._submit}>
            <FormGroup controlId="formFolderTitle" validationState={this._getValidationState("title")}>
              <ControlLabel>Title</ControlLabel>
              <FormControl
                style={error}
                type="text"
                placeholder=""
                onChange={this._handleTitleChange}
                value={titleInput}
              />
              <br />
              {
                catalogType != 'advertising' ?
                  <div className="live-program">
                    <ControlLabel className="titl">Live Program</ControlLabel>
                    <Input type="radio" checked={liveProgramYES} name="live_program" value="true"
                           onClick={this.handleLiveProgram.bind(this, true)}/> <ControlLabel
                    className="yesno">Yes</ControlLabel>
                    <Input type="radio" checked={liveProgramNO} name="live_program" value="false"
                           onClick={this.handleLiveProgram.bind(this, false)}/> <ControlLabel
                    className="yesno">No</ControlLabel>
                  </div>
                  :
                  null
              }
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._close}>Cancel</Button>
          <Button onClick={this._submit} bsStyle="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    );
  }
});

/**
 *
 */
module.exports = FolderForm;