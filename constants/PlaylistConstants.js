"use strict";
let keyMirror = require('keymirror');

/**
 *
 * @type {Object}
 */
module.exports = keyMirror({
  PUBLISH: 'PUBLISH',
  UNPUBLISH: 'UNPUBLISH',
  UPDATE: 'UPDATE',
  SHOW_FORM: 'SHOW_FORM',
  DELETE: 'DELETE',
  CLONE: 'CLONE',
  CREATE: 'CREATE',
  CREATE_CHILDREN: 'CREATE_CHILDREN',
  GET_PLAY_LIST_BY_CATALOG_TYPE: 'GET_PLAY_LIST_BY_CATALOG_TYPE'
});