import Immutable from 'immutable';
import { createSelector } from 'reselect';

const SET_STARTING = 'SET_STARTING';
const SET_STARTED = 'SET_STARTED';
const SET_STOP_TIMER = 'SET_STOP_TIMER';
const INC_PROGRESS_BAR = 'INC_PROGRESS_BAR';
const DEC_PROGRESS_BAR = 'DEC_PROGRESS_BAR';
const STOP_PROGRESS_BAR = 'STOP_PROGRESS_BAR';
const SET_SYPMPTON = 'SET_SYPMPTON';

const getProgress = state => state.get('progress');

const Progress = {

	/*
	* SELECTORS
	*/

	isStarting: createSelector(getProgress, progress => progress.get('starting')),
	getProgressBar: createSelector(getProgress, progress => progress.get('progressBar')),
	getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
	isStarted: createSelector(getProgress, progress => progress.get('started')),
	getSympton: createSelector(getProgress, progress => progress.get('sympton')),

	/*
	* ACTIONS
	*/

	start(value) {
		return (dispatch, getState) => {
			if (!Progress.getSympton(getState()) && !value) {
				dispatch(Progress.setSympton('unknown'));
			} else {
				dispatch(Progress.setSympton('known'));
			}
			if (!value) value = 100;
			dispatch(Progress.incProgressBar(value));
			const progressBarValue = Progress.getProgressBar(getState());
			if (progressBarValue > 1) {
				if (!Progress.isStarting(getState())) {
					setTimeout(() => {
						dispatch(Progress.setStarted(progressBarValue > 0));
					}, 100);
					if (!Progress.isStarting(getState()) && !Progress.isStarted(getState())) dispatch(Progress.setStarting());
				}
			}
		};
	},

	step(value) {
		return (dispatch, getState) => {
			if (!value) value = 0.01 * Progress.getProgressBar(getState());
			dispatch(Progress.decProgressBar(value));
			const progressBarValue = Progress.getProgressBar(getState());
			if (progressBarValue == 0) {
				const stopTimer = setTimeout(() => {
					dispatch(Progress.setStarted(false));
				}, 100);
				dispatch(Progress.setStopTimer(stopTimer));
			} else if (progressBarValue >= 1) {
				const stopTimer = Progress.getStopTimer(getState());
				if (stopTimer) {
					clearTimeout(stopTimer);
					dispatch(Progress.setStopTimer(0));
				}
			}
		};
	},

	setSympton(definition) {
		return {
			type: SET_SYPMPTON,
			definition
		};
	},

	stop() {
		return {
			type: STOP_PROGRESS_BAR,
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

	incProgressBar(value) {
		return {
			type: INC_PROGRESS_BAR,
			value
		}
	},

	decProgressBar(value) {
		return {
			type: DEC_PROGRESS_BAR,
			value
		}
	},

/*
* REDUCER
*/

	reducer(state = Immutable.fromJS({progressBar: 0}), action) {
	  switch (action.type) {

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

		  case INC_PROGRESS_BAR:
				// return state.set('progressBar', action.progressBar + 1);
			  return state.updateIn(['progressBar'], x => x + action.value);

		  case DEC_PROGRESS_BAR:
				// return state.set('progressBar', action.progressBar - 1);
			  return state.updateIn(['progressBar'], x => x - action.value);

			case STOP_PROGRESS_BAR:
				return state.set('progressBar', 0).set('started', false);

			case SET_SYPMPTON:
				return state.set('sympton', action.definition);

		  default:
	        return state;
	  };
	}

};

// const SET_STARTING = 'SET_STARTING';
// const SET_STARTED = 'SET_STARTED';
// const SET_STOP_TIMER = 'SET_STOP_TIMER';
// const INC_COUNTER = 'INC_COUNTER';
// const DEC_COUNTER = 'DEC_COUNTER';
//
// const getProgress = state => state.get('progress');
//
// const Progress = {
//
// 	/*
// 	* SELECTORS
// 	*/
//
// 	isStarting: createSelector(getProgress, progress => progress.get('starting')),
// 	getCounter: createSelector(getProgress, progress => progress.get('counter')),
// 	getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
// 	isStarted: createSelector(getProgress, progress => progress.get('started')),
//
// 	/*
// 	* ACTIONS
// 	*/
//
// 	start() {
// 		return (dispatch, getState) => {
// 			dispatch(Progress.incCounter(Progress.getCounter(getState())));
// 			if (Progress.getCounter(getState()) == 1) {
// 				if (!Progress.isStarting(getState())) {
// 					setTimeout(() => {
// 						dispatch(Progress.setStarted(Progress.getCounter(getState()) > 0));
// 					}, 100);
// 					dispatch(Progress.setStarting());
// 				}
// 			}
// 		};
// 	},
//
// 	stop() {
// 		return (dispatch, getState) => {
// 			dispatch(Progress.decCounter(Progress.getCounter(getState())));
// 			const counter = Progress.getCounter(getState());
// 			if (counter == 0) {
// 				const stopTimer = setTimeout(() => {
// 					dispatch(Progress.setStarted(false));
// 				}, 100);
// 				dispatch(Progress.setStopTimer(stopTimer));
// 			} else if (counter >= 1) {
// 				const stopTimer = Progress.getStopTimer(getState());
// 				if (stopTimer) {
// 					clearTimeout(stopTimer);
// 					dispatch(Progress.setStopTimer(0));
// 				}
// 			}
// 		};
// 	},
//
// 	setStarting() {
// 		return {
// 			type: SET_STARTING,
// 			starting: true
// 		}
// 	},
//
// 	setStarted(started) {
// 		return {
// 			type: SET_STARTED,
// 			started
// 		};
// 	},
//
// 	setStopTimer(stopTimer) {
// 		return {
// 			type: SET_STOP_TIMER,
// 			stopTimer
// 		};
// 	},
//
// 	incCounter(counter) {
// 		return {
// 			type: INC_COUNTER,
// 			counter
// 		}
// 	},
//
// 	decCounter(counter) {
// 		return {
// 			type: DEC_COUNTER,
// 			counter
// 		}
// 	},
//
// /*
// * REDUCER
// */
//
// 	reducer(state = Immutable.fromJS({counter: 0}), action) {
// 	  switch (action.type) {
//
// 		  case SET_STARTING:
// 			  return state.set('starting', action.starting);
//
// 		  case SET_STARTED:
// 			  let newState = state;
// 			  if (action.started) {
// 				  newState = newState.set('starting', false);
// 			  } else {
// 				  newState = newState.set('stopTimer', 0);
// 			  }
// 			  return newState.set('started', action.started);
//
// 		  case SET_STOP_TIMER:
// 			  return state.set('stopTimer', action.stopTimer);
//
// 		  case INC_COUNTER:
// 				// return state.set('counter', action.counter + 1);
// 			  return state.updateIn(['counter'], counter => counter + 1);
//
// 		  case DEC_COUNTER:
// 				// return state.set('counter', action.counter - 1);
// 			  return state.updateIn(['counter'], counter => counter - 1);
//
// 		  default:
// 	        return state;
// 	  };
// 	}
//
// };

export default Progress;
