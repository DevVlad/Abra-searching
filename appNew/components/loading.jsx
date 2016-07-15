import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import Progress from '../redux/ducks/progress.jsx';

import './App.css';

class Loading extends React.Component {
	constructor() {
		super();
		this.pulse = null;
		this.currentVisual = 1;
		this.toDisplay = 0;
	};

	componentWillUpdate(newProps) {
		// console.log('LOADING: componentWillUpdate', newProps)
		if (newProps.symptom === 'unknown' && newProps.progressBarValue < newProps.barEndPoint) {

		}
		if (newProps.symptom === 'unknown' && newProps.progress && newProps.xdrant > 0) {

				if (newProps.progressBarValue === newProps.barEndPoint) {
					this.toDisplay = this.toDisplay + (newProps.progressBarValue - this.toDisplay) / 2;
				} else {
					if (this.toDisplay > 0) {
						if (newProps.progressBarValue < newProps.barEndPoint) {
							let remains = (newProps.barEndPoint - this.toDisplay);
							let ratio = 1 - (newProps.progressBarValue / newProps.barEndPoint);
							this.toDisplay = this.toDisplay + ratio * remains;
						} else {
							this.toDisplay = this.toDisplay + (newProps.progressBarValue - this.toDisplay) / 2;
						}
					}
				}
		}
		if (newProps.symptom === 'known' && newProps.progress) {
			if (newProps.progressBarValue === newProps.barEndPoint) {
				if (this.toDisplay > 0) {
					this.toDisplay = this.toDisplay + 0.1 * (newProps.barEndPoint - this.toDisplay);
				} else {
						this.toDisplay = 0.1 * (newProps.barEndPoint - this.toDisplay);
				}

			}
			if (newProps.progressBarValue < newProps.barEndPoint) {
				let remains = (newProps.barEndPoint - this.toDisplay);
				let ratio = 1 - (newProps.progressBarValue / newProps.barEndPoint);
				this.toDisplay = this.toDisplay + ratio * remains;
			}
		}
		if (!newProps.progress && newProps.progressBarValue === 0 && this.toDisplay > 0) this.toDisplay = 100;

	}

  componentDidUpdate() {
		// if (this.pulse == null && this.loadRef != undefined) {
		// 	this.pulse = () => {
		// 		if (this.loadRef == undefined) {
		// 			this.pulse = null;
		// 		} else {
		// 			$(this.loadRef).delay(200).fadeOut('slow').delay(50).fadeIn('slow', this.pulse);
		// 		}
		// 	};
		// 	this.pulse();
		// }
  };

  render() {
		const style = {
      height: '3px',
      width: `${this.toDisplay}%`,
      backgroundColor: 'blue',
      transition: 'width 400ms ease-out, height 400ms linear',
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
			xdrant: 0,
			progressBarValue: Progress.getCounterValue(state),
			barEndPoint: Progress.getBarEndPoint(state)
		};
	} else {
		return {};
	}

};

const appConnect = connect(mapStateToProps)(Loading);
export default appConnect;
