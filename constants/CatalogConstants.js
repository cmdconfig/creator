"use strict";
let keyMirror = require('keymirror');

/**
 *
 * @type {Object}
 */
module.exports = keyMirror({
  SET_SELECTED_PLAYLIST: 'SET_SELECTED_PLAYLIST',
  SHOW_ADD_PLAYLIST_DIALOG: 'SHOW_ADD_PLAYLIST_DIALOG',
  UPDATE_CATALOG: 'UPDATE_CATALOG',
  SET_CATALOG_TYPE: 'SET_CATALOG_TYPE',
  CREATE_MEDIA_TEMPLATES: 'CREATE_MEDIA_TEMPLATES'
});