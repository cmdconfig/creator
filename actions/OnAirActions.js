"use strict";
let AppDispatcher = require('../dispatcher/AppDispatcher');
let OnAirConstants = require('../constants/OnAirConstants');

/**
 *
 * @type {{sortEditList: OnAirActions.sortEditList, search: OnAirActions.search}}
 */
let OnAirActions = {

  /**
   *
   * @param sortBy
   */
  sortEditList: function (sortBy) {
    AppDispatcher.dispatch({
      actionType: OnAirConstants.SORT_ON_AIR,
      sortBy: sortBy
    })
  },

  /**
   *
   * @param searchText
   */
  search: function (searchText) {
    AppDispatcher.dispatch({
      actionType: OnAirConstants.SEARCH_AON_AIR,
      searchText: searchText
    })
  }
};

module.exports = OnAirActions;