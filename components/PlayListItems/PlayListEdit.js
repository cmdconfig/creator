"use strict";
let React = require('react');
let EditingActions = require('../../actions/EditingActions');
let EditDatePicker = require('./EditItems/EditDatePicker');
let moment = require('moment');
let TimeLine = require('./TimeLine');

// require('react-datepicker/dist/react-datepicker.css'); подгрузка в header. src/Tviz/SSMBundle/Resources/views/Admin/Catalog/index.html.twig

/**
 *
 * @type {{1: string, 2: string, 3: string, 4: string}}
 */
let icoClasses = {
  1: 'ico ico_twiz_info',
  2: 'ico ico_twiz_quiz',
  3: 'ico ico_twiz_question',
  4: 'ico ico_twiz_prediction'
};

/**
 *
 */
let PlayListEdit = React.createClass({
  displayName: 'PlayListEdit',

  // propTypes: {
  //   playList: React.PropTypes.object
  // },

  /**
   *
   * @returns {{playList: *, selectedDateTimeLineViewDate: *, timeStart: *, timeFinish: *, date_start: *, date_end: *}}
   */
  getInitialState: function () {
    return {
      playList: this.props.playList,
      selectedDateTimeLineViewDate: moment(),
      timeStart: moment(),
      timeFinish: moment(),
      date_start: moment(),
      date_end: moment()
    };
  },

  /**
   *
   */
  handleAddTemplate: function () {
    let {playList} = this.props;
    EditingActions.createTemplate(playList.id)
  },

  /**
   *
   */
  handelPlusClick: function () {
    let {playList} = this.props;

    let now = moment();
    if (typeof playList.repeat === 'undefined' || playList.repeat.length == 0) {
      playList.repeat = [];
    }

    playList.repeat.push({dateStart: now.format('YYYY-MM-DD')});

    this.setState({
      playList: playList
    });

    // EditingActions.saveChangedPlayListL(this.state.playList,now);
  },

  /**
   *
   * @param data
   */
  handleChangeTimeLineDateTimeView: function (data) {
    this.setState({
      selectedDateTimeLineViewDate: data
    });
  },

  /**
   *
   */
  handleChangeTime: function () {
    let {selectedDateTimeLineViewDate} = this.state;
    let timeStart = this.refs.timeStart.value;
    let timeFinish = this.refs.timeFinish.value;
    let tmpStart = timeStart.split(':');
    let tmpFinish = timeFinish.split(':');
    let dateStart = selectedDateTimeLineViewDate.set('hour', parseInt(tmpStart[0])).set('minute', parseInt(tmpStart[1]));
    let dateEnd = selectedDateTimeLineViewDate.set({'hour': parseInt(tmpFinish[0]), 'minute': parseInt(tmpFinish[1])});

    this.setState({
      date_start: dateStart,
      date_end: dateEnd
    });
  },

  /**
   *
   */
  changeTimeLineView: function () {
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {playList} = this.props;
    let repeatItems = [];
    let timeLine = [];
    let startPoint = undefined;

    if (typeof playList.repeat !== 'undefined' && playList.repeat.length > 0) {
      playList.repeat.map(function (r, i) {
        let repType = 'START ';
        if (i > 0) {
          repType = 'REPEAT';
        }

        repeatItems.push(
          <EditDatePicker repeat={r} key={i} playListId={playList.id} repType={repType}/>
        );
      });
    }

    if (playList.repeat.length > 0) {
      startPoint = playList.repeat[0].date_start;
    }

    if (typeof  playList.children_play_list !== 'undefined' && playList.children_play_list.length > 0) {
      playList.children_play_list.map(function (childrenPlayList, i) {

        if (childrenPlayList.repeat.length > 0) {
          if (moment(startPoint).diff(moment(childrenPlayList.repeat[0].date_start) < 0)) {
            startPoint = childrenPlayList.repeat[0].date_start;
          }
        }
      });
    }

    timeLine.push(<TimeLine playList={playList} icoClasses={icoClasses} bgColor={"rgb(160, 160, 160)"}
                            startPoint={startPoint}/>);

    if (typeof  playList.children_play_list !== 'undefined' && playList.children_play_list.length > 0) {
      playList.children_play_list.map(function (childrenPlayList, i) {
        let bgColor = '#989898';
        if (i % 2 == 0) {
          bgColor = '#797979';
        }

        timeLine.push(
          <TimeLine playList={childrenPlayList} key={i} icoClasses={icoClasses} bgColor={bgColor}
                    startPoint={startPoint}/>
        );
      });
    }

    return (
      <div className="box playlists-box">
        <div className="box-header with-border">
          <div className="box-tools">
          </div>
        </div>
        <div className="box-body">
          <div className="playlist" style={{width: '520px'}}>
            <div className="header" style={{backgroundColor: '#a4bed7'}}>
              <div className="title">
                {playList.title}
              </div>
              <div className="body">
                <div className="play-list-tools--wrapper" style={{width:'100%', backgroundColor: '#dddddd'}}>
                  <span className={icoClasses[playList.catalog_type]} style={{cursor: 'pointer'}}
                        onClick={this.handleAddTemplate}/>
                  <div style={{float: 'right'}}>

                    <button id="bg-nested-dropdown" role="button" className="dropdown-toggle btn btn-default"
                             type="button">
                      <span onClick={this.handelPlusClick}>Add New Folder (Serial)</span>
                    </button>

                    <i className=" fa fa-play" onClick={this._onTogglePublish}/>
                    <i className="fa fa-trash" onClick={this._onDelete}/>
                    <i className="fa fa-gears" onClick={this._showSettings}/>
                  </div>

                  {repeatItems}

                </div>
                {/**
                 <div>
                 <DatePicker
                 selected={selectedDateTimeLineViewDate}
                 onChange={this.handleChangeTimeLineDateTimeView}
                 className="data-picker--edit"
                 dateFormat="DD.MM.YYYY"
                 />
                 <span className="time-start"><input
                 onChange={this.handleChangeTime}
                 ref="timeStart" style={{width: '40px'}} value={timeStart.format('H:m')}/></span> /

                 <span className="time-end"><input
                 onChange={this.handleChangeTime}
                 ref="timeFinish" style={{width: '40px'}}  value={timeFinish.format('H:m')}/></span>
                 </div>*/}
                <div className="time-line--wrapper" style={{backgroundColor: 'gray', overflowX: 'auto'}}>

                  <div className="aims aims_play" style={{paddingLeft: '1200px', width: '2681px'}}>
                    <div className="aim play" style={{left: '1200px'}}>00:00</div>
                  </div>

                  <div>
                    <i className="glyphicon glyphicon-plus" onClick={this.handelPlusClick}/></div>
                  {timeLine}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="box-footer"></div>
      </div>
    )
  }
});

/**
 *
 */
module.exports = PlayListEdit;