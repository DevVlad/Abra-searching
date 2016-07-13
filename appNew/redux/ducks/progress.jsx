import Immutable from 'immutable';
import { createSelector } from 'reselect';

const SET_STARTING = 'SET_STARTING';
const SET_STARTED = 'SET_STARTED';
const SET_STOP_TIMER = 'SET_STOP_TIMER';
const INC_PROGRESS_BAR = 'INC_PROGRESS_BAR';
const DEC_PROGRESS_BAR = 'DEC_PROGRESS_BAR';
const STOP_PROGRESS_BAR = 'STOP_PROGRESS_BAR';
const SET_SYMPTOM_KNOWN = 'SET_SYMPTOM_KNOWN';
const SET_SYMPTOM_UNKNOWN = 'SET_SYMPTOM_UNKNOWN';
const INC_XDRANT = 'INC_XDRANT';

const getProgress = state => state.get('progress');

const Progress = {

	/*
	* SELECTORS
	*/

	isStarting: createSelector(getProgress, progress => progress.get('starting')),
	isStarted: createSelector(getProgress, progress => progress.get('started')),
	getProgressBarValue: createSelector(getProgress, progress => progress.get('progressBar')),
	getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
	getStartTimer: createSelector(getProgress, progress => progress.get('startTimer')),
	getSymptom: createSelector(getProgress, progress => progress.get('sympton')),
	getXdrant: createSelector(getProgress, progress => progress.get('xdrant')),

	/*
	* ACTIONS
	*/

	start(value) {
		return (dispatch, getState) => {
			let progressBarValue = Progress.getProgressBarValue(getState());
			if (!value) {
				if (Progress.getSymptom(getState()) !== 'unknown') {
					if (Progress.getSymptom(getState()) === 'known') {
						dispatch(Progress.setSymptomUnknown('unknown', true));
					} else {
						dispatch(Progress.setSymptomUnknown('unknown'));
					}
				}
				if (progressBarValue == 0) dispatch(Progress.incProgressBar(100));
				progressBarValue = Progress.getProgressBarValue(getState());
				if (progressBarValue > 0) {
					if (!Progress.isStarting(getState())) {
						const startTimer = setTimeout(() => {
							dispatch(Progress.setStarted(progressBarValue > 0));
							dispatch(Progress.incXdrant());
						}, 100);
						if (!Progress.isStarting(getState()) && !Progress.isStarted(getState())) dispatch(Progress.setStarting(startTimer));
					}
				}

			} else {
				if (Progress.getSymptom(getState()) !== 'known') {
					if (Progress.getSymptom(getState()) === 'unknown') {
						dispatch(Progress.setSymptomKnown('known', true));
					} else {
						dispatch(Progress.setSymptomKnown('known'));
					}
				}
				dispatch(Progress.incProgressBar(value));
				progressBarValue = Progress.getProgressBarValue(getState());
				if (progressBarValue > 0) {
					if (!Progress.isStarting(getState())) {
						const startTimer = setTimeout(() => {
							dispatch(Progress.setStarted(progressBarValue > 0));
						}, 100);
						if (!Progress.isStarting(getState()) && !Progress.isStarted(getState())) dispatch(Progress.setStarting(startTimer));
					}
				}
			}

		};
	},

	incXdrant() {
		return {
			type: INC_XDRANT
		};
	},

	step(value) {
		return (dispatch, getState) => {
			if (!value) value = 0.01 * Progress.getProgressBarValue(getState());
			dispatch(Progress.decProgressBar(value));
			const progressBarValue = Progress.getProgressBarValue(getState());
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

	setSymptomKnown(definition, changeOfSymptom = false) {
		return {
			type: SET_SYMPTOM_KNOWN,
			definition,
			changeOfSymptom
		};
	},

	setSymptomUnknown(definition, changeOfSymptom = false) {
		return {
			type: SET_SYMPTOM_UNKNOWN,
			definition,
			xdrant: 1,
			changeOfSymptom
		};
	},

	stop() {
		return (dispatch, getState) => {
			if (Progress.isStarting(getState())) {
				clearTimeout(Progress.getStartTimer(getState()));
				if (Progress.getSymptom(getState()) === 'known') {
					dispatch({ type: STOP_PROGRESS_BAR, toShutDown: ['starting', 'sympton'] });
				} else {
					dispatch({ type: STOP_PROGRESS_BAR, toShutDown: ['sympton', 'starting', 'xdrant'] });
				}

			} else if (Progress.isStarted(getState())) {
				dispatch(Progress.setStarted(false));
				if (Progress.getSymptom(getState()) === 'known') {
					dispatch({ type: STOP_PROGRESS_BAR, toShutDown: ['sympton'] });
				} else {
					dispatch({ type: STOP_PROGRESS_BAR, toShutDown: ['sympton', 'xdrant'] });
				}

			}
		};

	},

	setStarting(timer) {
		return {
			type: SET_STARTING,
			starting: true,
			timer
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
			  return state.set('starting', action.starting).set('startTimer', action.timer);

		  case SET_STARTED:
			  let newState = state;
			  if (action.started) {
				  newState = newState.set('starting', false);
			  } else {
				  newState = newState.set('stopTimer', 0);
			  }
			  return newState.set('started', action.started).set('startTimer', undefined);

		  case SET_STOP_TIMER:
			  return state.set('stopTimer', action.stopTimer);

		  case INC_PROGRESS_BAR:
			  return state.updateIn(['progressBar'], x => x + action.value);

		  case DEC_PROGRESS_BAR:
			  return state.updateIn(['progressBar'], x => x - action.value);

			case STOP_PROGRESS_BAR:
				let pomState = state;
				action.toShutDown.forEach( x => {
					pomState = pomState.set(x, undefined);
				});
				return pomState.set('progressBar', 0);

			case SET_SYMPTOM_KNOWN:
				if (action.changeOfSymptom) {
					return state.set('sympton', action.definition).set('xdrant', undefined);
				}
				return state.set('sympton', action.definition);

			case SET_SYMPTOM_UNKNOWN:

				return state.set('sympton', action.definition).set('xdrant', action.xdrant);

			case INC_XDRANT:
				return state.updateIn(['xdrant'], xdrantCount => xdrantCount + 1);

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
