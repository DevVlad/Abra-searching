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
		this.endPoint = 0;
		this.toDisplay = 0;
	};

	componentWillUpdate() {
		// console.log(this.props)
		const props = this.props;
		if (props.progress && props.symptom === 'known') {
			if (this.endPoint < props.progressBarValue) {
				this.endPoint = props.progressBarValue;
			} else {
				this.currentVisual = props.progressBarValue;
			}
			this.currentVisual/this.endPoint*100 == 0 ? this.toDisplay = 100 : this.toDisplay = this.currentVisual/this.endPoint*100;
		}

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
				this.toDisplay = 0;
				this.setState({});
			}, 700)
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
	if (Progress.isStarted(state) && Progress.getSymptom(state)) {
		return {
			progress: Progress.isStarted(state),
			xdrant: Progress.getXdrant(state),
			progressBarValue: Progress.getProgressBarValue(state),
			symptom: Progress.getSymptom(state)
		};
	} else {
		return {}
	}

};

const appConnect = connect(mapStateToProps)(Loading);
export default appConnect;
