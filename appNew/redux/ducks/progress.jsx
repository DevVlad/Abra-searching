import Immutable from 'immutable';
import { createSelector } from 'reselect';

// const SET_PROGRESS = 'SET_PROGRESS';
const SET_STARTING = 'SET_STARTING';
const SET_STARTED = 'SET_STARTED';
const SET_STOP_TIMER = 'SET_STOP_TIMER';
const INC_COUNTER = 'INC_COUNTER';
const DEC_COUNTER = 'DEC_COUNTER';

// const getProgressState = (state) => state.getIn(['progress', 'loading']);

const getProgress = state => state.get('progress');
const getCounter = createSelector(getProgress, x => {
	if (x.size == 0) {
		return 0;
	} else {
		return x.get('counter');
	}
});
const getStarting = createSelector(getProgress, x => x.get('starting'));
const getStopTimer = createSelector(getProgress, x => x.get('stopTimer'));
const isStarted = createSelector(getProgress, x => x.get('started'));

const Progress = {

	/*
	* SELECTORS
	*/

	getCounter(state) {
		return getCounter(state);
	},

	isStarting(state) {
		return getStarting(state);
	},

	getStopTimer(state) {
		return getStopTimer(state);
	},

	isStarted(state) {
		return isStarted(state);
	},

	// isStarting: createSelector(getProgress, progress => progress.get('starting')),
	// getCounter: createSelector(getProgress, progress => {
	// 	if (progress === undefined) {
	// 		return 0;
	// 	} else {
	// 		progress.get('counter')
	// 	}
	// }),
	// getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
	// isStarted: createSelector(getProgress, progress => progress.get('started')),

	/*
	* ACTIONS
	*/

	start() {
		return (dispatch, getState) => {
			dispatch(Progress.incCounter(Progress.getCounter(getState())));
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
			dispatch(Progress.decCounter(Progress.getCounter(getState())));
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

	incCounter(counter) {
		return {
			type: INC_COUNTER,
			counter
		}
	},

	decCounter(counter) {
		return {
			type: DEC_COUNTER,
			counter
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
				  newState = newState.set('starting', false);
			  } else {
				  newState = newState.set('stopTimer', 0);
			  }
			  return newState.set('started', action.started);

		  case SET_STOP_TIMER:
			  return state.set('stopTimer', action.stopTimer);

		  case INC_COUNTER:
				return state.set('counter', action.counter + 1);
			  // return state.updateIn(['counter'], counter => counter + 1);

		  case DEC_COUNTER:
				return state.set('counter', action.counter - 1);
			  // return state.updateIn(['counter'], counter => counter - 1);

		  default:
	        return state;
	  }
	}

};

export default Progress;
