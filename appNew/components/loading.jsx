import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import Progress from '../redux/ducks/progress.jsx';

import './App.css';

class Loading extends React.Component {
	constructor() {
		super();
		this.pulse = null;
		this.startPoint = 0;
		this.currentVisual = 1;
		this.toDisplay = 0;
		this.speed = 750;
	};

	componentWillUpdate() {
		const props = this.props;
		if (props.progress && props.symptom === 'known') {
			if (props.progressBarValue === props.barEndPoint) {
				this.currentVisual = 0.1 * props.progressBarValue;
			} else {
				this.currentVisual = props.progressBarValue;
			}
			if (props.progressBarValue === props.barEndPoint) {
				this.toDisplay = this.toDisplay + 0.1 * props.barEndPoint
			} else {
				let pom = props.progressBarValue / props.barEndPoint * 100;
				if (pom > this.toDisplay) {
					this.toDisplay = pom;
				} else {
					this.toDisplay = this.toDisplay + (100 - this.toDisplay) * 0.1
				}

			}
			// props.progressBarValue == 0 ? this.toDisplay = 100 : this.toDisplay = this.currentVisual/props.barEndPoint*100;
		}
		if (props.progress && props.symptom === 'unknown') {

			if (props.xdrant === 0) {
				this.toDisplay = props.progressBarValue / 2;;
			} else {
				this.speed = this.speed * (this.toDisplay/100);
				let restOfBar = (props.progressBarValue - this.toDisplay) / 2;
				this.toDisplay = this.toDisplay + restOfBar;
			}
		}
		if ((props.progressBarValue === 0 || props.progress === false) && this.toDisplay > 0 && props.symptom) {
		// if (props.progress === false && this.toDisplay > 0 && props.symptom) {
			this.toDisplay = 100;
		}
		// console.log('componentWillUpdate',props, props.progress,this.toDisplay, this.speed)
	};

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
				if (this.toDisplay === 100) {
					this.toDisplay = 0;
					this.setState({});
				}
			}, 700);
		}

    if (this.toDisplay > 0 ) {
      // return (
      //   <div id='loading' ref={(ref) => this.loadRef = ref}>
      //     <h2 >Loading...</h2>
			// 		<div style={style} className='ProgressBar'></div>
      //   </div>
      // );
			return (
					<div style={style} className='ProgressBar'></div>
      );
    } else return null;
  };

};

function mapStateToProps(state) {
	if (Progress.isStarted(state) !== undefined) {
		return {
			progress: Progress.isStarted(state),
			xdrant: Progress.getXdrant(state),
			progressBarValue: Progress.getProgressBarValue(state),
			symptom: Progress.getSymptom(state),
			barEndPoint: Progress.getBarEndPoint(state)
		};
	} else {
		return {};
	}

};

const appConnect = connect(mapStateToProps)(Loading);
export default appConnect;
