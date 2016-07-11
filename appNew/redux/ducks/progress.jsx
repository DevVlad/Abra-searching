import Immutable from 'immutable';
import { createSelector } from 'reselect';

const TEST = 'TEST';
const SET_PROGRESS = 'SET_PROGRESS';
const SET_STARTING = 'SET_STARTING';
const SET_STARTED = 'SET_STARTED';
const SET_STOP_TIMER = 'SET_STOP_TIMER';
const INC_COUNTER = 'INC_COUNTER';
const DEC_COUNTER = 'DEC_COUNTER';

// const getProgressState = (state) => state.getIn(['progress', 'loading']);

const getProgress = state => state.get('progress');

const Progress = {

	/*
	* ACTIONS
	*/

	isStarting: createSelector(getProgress, progress => progress.get('starting')),
	getCounter: createSelector(getProgress, progress => progress.get('counter')),
	getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
	isStarted: createSelector(getProgress, progress => progress.get('started')),

	start() {
		return (dispatch, getState) => {
			dispatch(Progress.incCounter());
			if (Progress.getCounter(getState()) == 1) {
				if (!Progress.isStarting(getState())) {
					setTimeout(() => {
						dispatch(Progress.setStarted(Progress.getCounter(getState()) > 0));
					}, 100);
					dispatch(Progress.setStarting());
				}
			}
		};
	},

	stop() {
		return (dispatch, getState) => {
			dispatch(Progress.decCounter());
			const counter = Progress.getCounter(getState());
			if (counter == 0) {
				const stopTimer = setTimeout(() => {
					dispatch(Progress.setStarted(false));
				}, 100);
				dispatch(Progress.setStopTimer(stopTimer));
			} else if (counter >= 1) {
				const stopTimer = Progress.getStopTimer(getState());
				if (stopTimer) {
					clearTimeout(stopTimer);
					dispatch(Progress.setStopTimer(0));
				}
			}
		};
	},

	setStarting() {
		return {
			type: SET_STARTING,
			starting: true
		}
	},

	setStarted(started) {
		return {
			type: SET_STARTED,
			started
		};
	},

	setStopTimer(stopTimer) {
		return {
			type: SET_STOP_TIMER,
			stopTimer
		};
	},

	incCounter() {
		return {
			type: INC_COUNTER
		}
	},

	decCounter() {
		return {
			type: DEC_COUNTER
		}
	},

	// setProgress(bool) {
	// 	progressBin.push(bool);
	// 	return (dispatch, getState) => {
	// 		let toNotice = [];
	// 		const timeID = setTimeout( () => {
	// 			if (bool !== getProgress(getState())) {
	// 				console.log('dispatch: setCurrentState', bool);
	// 				dispatch(Progress.setCurrentState(bool));
	// 			};
	// 		}, 100);
	// 		timesBin.push(timeID);
	//
	// 		if(progressBin[progressBin.length-2] === bool) {
	// 			clearTimeout(timesBin[progressBin.length-1]);
	// 			timesBin[progressBin.length-1] = 0;
	// 		} else if(progressBin[progressBin.length-3] === bool) {
	// 			clearTimeout(timesBin[progressBin.length-2]);
	// 			timesBin[progressBin.length-2] = 0;
	// 		}
	// 	};
	// },
	//
	// setCurrentState(bool)
	// {
	// 	return {
	// 		type: SET_PROGRESS,
	// 		bool
	// 	};
	// },


/*
* REDUCER
*/

	reducer(state = Immutable.fromJS({}), action) {
	  switch (action.type) {

	    // case SET_PROGRESS:
			// 	return state.setIn(['loading'], action.bool);

		  case SET_STARTING:
			  return state.set('starting', action.starting);

		  case SET_STARTED:
			  let newState = state;
			  if (action.started) {
				  newState = state.set('starting', false);
			  } else {
				  newState = state.set('stopTimer', 0);
			  }
			  return newState.set('started', action.started);

		  case SET_STOP_TIMER:
			  return state.set('stopTimer', action.stopTimer);

		  case INC_COUNTER:
			  return state.updateIn(['counter'], counter => counter + 1);

		  case DEC_COUNTER:
			  return state.updateIn(['counter'], counter => counter - 1);

		  default:
	        return state;
	  }
	},

	getOwnState(state) {
		return {
			progress: Progress.isStarted(state)
		};
	}

};

// let progressBin = [];
// let timesBin = [];
// let counter = 0;

//const getProgress = createSelector(getProgressState, x => x);

export default Progress;
