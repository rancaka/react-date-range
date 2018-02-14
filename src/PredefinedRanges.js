import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import parseInput from './utils/parseInput.js';
import { defaultClasses } from './styles.js';
import moment from 'moment';

class PredefinedRanges extends Component {

  constructor(props, context) {
    super(props, context);

    this.handleBlur = this.handleBlur.bind(this);

    this.styles = this.props.theme;
    this.state = {
      error: {}
    }
  }

  handleSelect(name, event) {
    event.preventDefault();

    const range = this.props.ranges[name];

    this.props.onSelect({
      startDate : parseInput(range['startDate'], null, 'startOf'),
      endDate   : parseInput(range['endDate'], null, 'endOf'),
    }, PredefinedRanges);
  }

  handleBlur(key) {
    return (e) => {
      let date = moment(e.target.value).format('DD MMM YYYY');

      if (Number(e.target.value) < 13 || e.target.value.length > 11 || e.target.value.length < 10 || date === 'Invalid date') {
        this.setState({
          error: {
            [key]: true
          }
        });
        return this.props.onSelect({
          ...this.props.range
        });
      };
      
      this.setState({
        error: {
          [key]: false
        }
      })

      this.props.onSelect({
        ...this.props.range,
        [key] : parseInput(e.target.value, null, key === 'startDate' ? 'startOf' : 'endOf')
      })
    }
  }

  renderRangeList(classes) {
    const { ranges, range, onlyClasses } = this.props;
    const { styles } = this;

    return Object.keys(ranges).map(name => {
      const active = (
        parseInput(ranges[name].startDate, null, 'startOf').isSame(range.startDate) &&
        parseInput(ranges[name].endDate, null, 'endOf').isSame(range.endDate)
      );

      const style = {
        ...styles['PredefinedRangesItem'],
        ...(active ? styles['PredefinedRangesItemActive'] : {}),
      };

      const predefinedRangeClass = classnames({
        [classes.predefinedRangesItem]: true,
        [classes.predefinedRangesItemActive]: active
      });

      return (
        <a
          href='#'
          key={'range-' + name}
          className={predefinedRangeClass}
          style={ onlyClasses ? undefined : style }
          onClick={this.handleSelect.bind(this, name)}
        >
          {name}
        </a>
      );
    });
  }

  render() {
    const { style, onlyClasses, classNames, enableInputDate } = this.props;
    const { styles } = this;

    const classes = { ...defaultClasses, ...classNames };

    return (
      <div
        style={onlyClasses ? undefined : { ...styles['PredefinedRanges'], ...style }}
        className={ classes.predefinedRanges }
      >
        {
          enableInputDate && (
            <div className={ classes.inputDate }>
              <div>
                <label htmlFor="from">From:</label>
                <input
                  id="from"
                  type="text"
                  defaultValue={ moment(this.props.range.startDate).format('DD MMM YYYY') }                  
                  onBlur={ this.handleBlur('startDate') } />
                  { this.state.error.startDate && <div style={{ color: '#eb5055', fontSize: '10px' }}>Invalid format. Ex: <i>15 Dec 1994</i></div> }
              </div>
              <div>
                <label htmlFor="to">To:</label>
                <input
                  id="to"
                  type="text"
                  defaultValue={ moment(this.props.range.endDate).format('DD MMM YYYY') }
                  onBlur={ this.handleBlur('endDate') } />
                  { this.state.error.endDate && <div style={{ color: '#eb5055', fontSize: '10px' }}>Ex: <i>15 Dec 1994</i></div> }                  
              </div>
            </div>
          )
        }
        { this.renderRangeList(classes) }
      </div>
    );
  }
}

PredefinedRanges.defaultProps = {
  onlyClasses : false,
  classNames  : {}
};

PredefinedRanges.propTypes = {
  ranges      : PropTypes.object.isRequired,
  onlyClasses : PropTypes.bool,
  classNames  : PropTypes.object
}

export default PredefinedRanges;
