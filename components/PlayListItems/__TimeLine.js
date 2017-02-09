let React = require('react');
let moment = require('moment');

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

    if (playList.repeat.length > 0) {
      // playList.repeat.map(function(item){ //если нужно вывести несколько 'repeat'
      repeatItems.push(
        this.createTimeItem(playList.repeat[0])
      );
      // });
    }

    if (maxTmLineWith == 0) {
      maxTmLineWith = '98%'
    } else {
      maxTmLineWith += 'px'
    }

    maxTmLineWith = '3000px';

    return (
      <div>
        <div className={icoClasses[playList.pl_type]}
             style={{
                float: 'left',
                width: '30px',
                height: '30px',
                backgroundColor: bgColor,
                position: 'fixed',
                zIndex: 10
          }}></div>
        <div style={{float: 'left', backgroundColor: bgColor, width: maxTmLineWith, height: '30px'}}>
          {repeatItems}
        </div>

        <br style={{clear: 'both'}}/>
      </div>
    );
  }
});

/**
 *
 */
module.exports = TimeLine;