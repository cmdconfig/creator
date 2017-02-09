"use strict";
let React = require('react');
let TreeStore = require('../stores/TreeStore');

/**
 *
 */
let AddTemplateForm = React.createClass({
  PropTypes: {
    folder: React.PropTypes.object
  },

  /**
   *
   * @returns {{show: boolean, folder: *, templateList: (*|Array)}}
   */
  getInitialState: function () {
    TreeStore.initTemplatesList();
    return {
      show: false,
      folder: this.props.folder,
      templateList: TreeStore.getTemplateList()
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
   * @private
   */
  _submit: function () {
    this._close();
  },

  /**
   *
   * @param e
   * @private
   */
  _handleTemplateChange: function (e) {
    this.setState({
      template: Object.assign({}, this.state.template, {value: e.target.value})
    });
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {show} = this.state;

    return (
      <div>
        <Modal show={show} onHide={this._close} onExited={this._exited}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Folder</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this._submit}>
              <FormGroup controlId="formTemplate">
                <ControlLabel>Template</ControlLabel>
                <Select
                  name="form-field-name"
                  value="one"
                  options={options}
                  onChange={this._handleTemplateChange}
                />
              </FormGroup>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._submit} bsStyle="primary">Save</Button>
            <Button onClick={this._close}>Cansel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = AddTemplateForm;