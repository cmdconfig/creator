"use strict";
let React = require('react');
let DatePicker = require('react-datepicker');
let EditingActions = require('../../../actions/EditingActions');
let moment = require('moment');
let EditStore = require('../../../stores/EditStore');

/**
 *
 */
let EditDatePicker = React.createClass({
  // propTypes: {
  //   repeat: React.PropTypes.object,
  //   playListId: React.PropTypes.number,
  //   repType: React.PropTypes.string
  // },

  /**
   *
   * @returns {{repeat: *}}
   */
  getInitialState: function () {
    return {
      repeat: this.props.repeat
    }
      ;
  },

  /**
   *
   * @param nextProps
   */
  componentWillReceiveProps: function (nextProps) {
    this.setState({
      repeat: nextProps.repeat,
      timeStart: nextProps.repeat.date_start,
      timeFinish: nextProps.repeat.date_end

    });
  },

  /**
   *
   * @param date
   */
  handleChangeDate: function (date) {
    let {timeStart, timeFinish} = this.state;
    let dateStart = date.format('YYYY-MM-DD') + ' ' + moment(timeStart).format('HH:mm');
    let dateEnd = date.format('YYYY-MM-DD') + ' ' + moment(timeFinish).format('HH:mm');

    this.setState({
      repeat: {
        date_start: moment(dateStart).format('YYYY-MM-DD HH:mm'),
        date_end: moment(dateEnd).format('YYYY-MM-DD HH:mm')
      }
    });
  },

  /**
   *
   */
  handleChangeTime: function () {
    let timeStart = this.refs.timeStart.value;
    let timeFinish = this.refs.timeFinish.value;
    let {repeat} = this.state;
    let tmpStart = timeStart.split(':');
    let tmpFinish = timeFinish.split(':');
    let dateStart = moment(repeat.date_start).set('hour', parseInt(tmpStart[0])).set('minute', parseInt(tmpStart[1]));
    let dateEnd = moment(repeat.date_start).set({'hour': parseInt(tmpFinish[0]), 'minute': parseInt(tmpFinish[1])});

    this.setState({
      timeStart: timeStart,
      timeFinish: timeFinish,
      repeat: {
        id: repeat.id,
        date_start: dateStart,
        date_end: dateEnd
      }
    });
  },

  /**
   *
   */
  handleChangeTimeFinish: function () {
    let timeFinish = this.refs.timeFinish.value;
    let {repeat} = this.state;
    let tmp = timeFinish.split(':');
    let dateEnd = moment(repeat.date_end).hours(tmp[0]).minutes(tmp[1]);

    this.setState({
      repeat: {
        date_end: dateEnd
      }
    });
  },

  /**
   *
   */
  handleSaveDataPicker() {
    let {repeat} = this.state;
    EditingActions.saveChangedPlayList(this.props.playListId, repeat);
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {repeat} = this.state;
    let {repType} =this.props;
    let dateStart = moment(repeat.date_start);
    let dateEnd = moment(repeat.date_end);

    return (
      <div style={{marginLeft: '43px'}}>
        <b style={{marginRight: '5px'}}>{repType}</b>
        <DatePicker
          selected={dateStart}
          onChange={this.handleChangeDate}
          className="data-picker--edit"
          dateFormat="DD.MM.YYYY"
        />

        <span className="time-start"><input
          onBlur={this.handleSaveDataPicker}
          onChange={this.handleChangeTime}
          ref="timeStart" style={{width: '40px'}} value={dateStart.format('H:m')}/></span> /

        <span className="time-end"><input
          onBlur={this.handleSaveDataPicker}
          onChange={this.handleChangeTime}
          ref="timeFinish" style={{width: '40px'}} value={dateEnd.format('H:m')}/></span>
      </div>
    );
  }
});

/**
 *
 */
module.exports = EditDatePicker;