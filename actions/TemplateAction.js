"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let TemplateConstants = require('../constants/TemplateConstants');

/**
 *
 * @type {{sortEditList: TemplateAction.sortEditList, search: TemplateAction.search}}
 */
let TemplateAction = {

  /**
   *
   * @param sortBy
   */
  sortEditList: function (sortBy) {
    AppDispatcher.dispatch({
      actionType: TemplateConstants.SORT_TEMPLATE,
      sortBy: sortBy
    })
  },

  /**
   *
   * @param searchText
   */
  search: function (searchText) {
    AppDispatcher.dispatch({
      actionType: TemplateConstants.SEARCH_TEMPLATE,
      searchText: searchText
    })
  }
};

module.exports = TemplateAction;