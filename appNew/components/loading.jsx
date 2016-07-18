import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import Progress from '../redux/ducks/progress.jsx';

import './App.css';

class Loading extends React.Component {
	constructor() {
		super();
		this.pulse = null;
		this.toDisplay = 0;
	};

	componentWillUpdate(newProps) {
    if (newProps.progress) this.toDisplay = newProps.progressBar;
  }

  render() {
		const style = {
      height: '3px',
      width: `${this.toDisplay}%`,
      background: '-webkit-linear-gradient(-45deg, rgba(197,222,234,1) 0%,rgba(138,187,215,1) 41%,rgba(138,187,215,1) 41%,rgba(6,109,171,1) 83%)',
      transition: 'width 400ms ease-in, height 400ms linear',
      position: 'absolute',
    };

		if (this.toDisplay === 100) {
			setTimeout( () => {
        this.toDisplay = 0;
					this.setState({});
			}, 700);
		}

    if (this.toDisplay > 0) {
			return (
					<div style={style} className='ProgressBar'></div>
			);
    } else return null;
  }

};

function mapStateToProps(state) {
	if (Progress.isStarted(state) !== undefined) {
		return {
			progress: Progress.isStarted(state),
			progressBar: Progress.getProgressBarPercent(state),
			barEndPoint: Progress.getBarEndPoint(state)
		};
	} else {
		return {};
	}

};

const appConnect = connect(mapStateToProps)(Loading);
export default appConnect;
