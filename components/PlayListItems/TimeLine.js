"use strict";
let React = require('react');
let moment = require('moment');
let slimscroll = require('react-slimscroll');
/**
 *
 * @type {number}
 */
let maxTmLineWith = 0;

/**
 *
 */
let TimeLine = React.createClass({
  // PropTypes: {
  //   playList: React.PropTypes.object,
  //   icoClasses: React.PropTypes.object,
  //   bgColor: React.PropTypes.string,
  //   startPoint: React.PropTypes.object
  // },

  /**
   *
   * @param item
   * @returns {XML}
   */
  createTimeItem: function (item) {
    let {startPoint} = this.props;
    let itemWidth = (moment(item.date_end) - moment(item.date_start)) / 50000;
    let itemMarginLeft = Math.abs((moment(startPoint) - moment(item.date_start)) / 50000);
    maxTmLineWith += (itemWidth + itemMarginLeft);

    let itemProcess = (moment() - moment(item.date_end)) / 50000;

    if (itemProcess > itemWidth) {
      itemProcess = parseInt(itemWidth) - 4;
    }
    return (
      <div className="repeatTime"
           style={{
                backgroundColor: 'green',
                width: itemWidth + 'px',
                marginLeft: (itemMarginLeft + 30) + 'px',
                height: '30px',
                float: 'left',
                fontSize: '10px',
                border: '1px solid #adadad'
             }}>
        <div
          style={{position:'absolute', margineBotom: '-15px'}}>{moment(item.date_start).format('DD-MM-YY HH:mm')}</div>
        <div
          style={{
          backgroundColor: '#47a047',
          height: '24px',
          margin: '3px 0 3px 0',
          width: itemProcess
          }}
        ></div>
      </div>
    );
  },

  /**
   *
   * @returns {XML}
   */
  render: function () {
    let {playList, icoClasses, bgColor} = this.props;
    let repeatItems = [];

    // if(playList.repeat.length > 0) {
    //   // playList.repeat.map(function(item){ //если нужно вывести несколько 'repeat'
    //     repeatItems.push(
    //       this.createTimeItem(playList.repeat[0])
    //     );
    //   // });
    // }

    if (maxTmLineWith == 0) {
      maxTmLineWith = '98%'
    } else {
      maxTmLineWith += 'px'
    }

    maxTmLineWith = '3000px';

    let ruler = [];
    for (let i = 0; i <= 3; i++) {
      ruler.push(
        <div id={`ruler${i}`}>
          <div className="time"></div>
          <div className="aims aims_hand">
            <div className="aim hand" style={{display: 'none'}}>00:00:00</div>
          </div>
          <div className="tracks">
            <div className="track track1"></div>
            <div className="track track2"></div>
            <div className="track track3"></div>
            <div className="track track4"></div>
          </div>
        </div>
      );
    }

    return (
      <div className="playlist-timeline">
        <div className="open"></div>
        <div className="close"></div>
        <div className="timeline-title"><label />
          <span className="column-title-count"/>

          <div className="zoom">Zoom
            <div className="zoom1">1</div>
            <div className="zoom2">2</div>
            <div className="zoom3">3</div>
          </div>
        </div>
        <div className="ruler-container">
          {ruler}
        </div>
        <div className="time-line">
          <div className="line N1">
            <div className="ico ico_twiz_info"></div>
          </div>
          <div className="line N2">
            <div className="ico ico_twiz_quiz"></div>
          </div>
          <div className="line N3">
            <div className="ico ico_twiz_question"></div>
          </div>
          <div className="line N4">
            <div className="ico ico_twiz_prediction"></div>
          </div>
        </div>
        <div className="scroll_lr">
          <div className="lft"></div>
          <div className="scrolls">
            <div className="scroll"></div>
          </div>
          <div className="rght"></div>
          <div className="panel_play">
            <table style={{width: '100%'}}>
              <tbody>
              <tr>
                <td className="left"/>
                <td className="left1"/>
                <td className="left2"/>
                <td className="play-time"/>
                <td className="right2"/>
                <td className="right1"/>
                <td className="right"/>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="statusbar">
          Total Widgets - <span className="all-count"/>
          <img src="/i/ico/info.png" title="Info"/> - <span className="info-count"/>
          <img src="/i/ico/quiz.png" title="Quiz"/> - <span className="quiz-count"/>
          <img src="/i/ico/question.png" title="Question"/> - <span className="question-count"/>
          <img src="/i/ico/prediction.png" title="Prediction"/> - <span className="prediction-count"/>
        </div>
      </div>
    );
  }
});

/**
 *
 */
module.exports = TimeLine;