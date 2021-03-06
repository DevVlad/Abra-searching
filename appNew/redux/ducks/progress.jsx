import Immutable from 'immutable';
import { createSelector } from 'reselect';

const SET_STARTING = 'SET_STARTING';
const SET_STARTED = 'SET_STARTED';
const SET_STOP_TIMER = 'SET_STOP_TIMER';
const INC_COUNTER = 'INC_COUNTER';
const DEC_COUNTER = 'DEC_COUNTER';
const SET_PERCENT = 'SET_PERCENT';
const SET_BAR_END = 'SET_BAR_END';

const getProgress = state => state.get('progress');

const Progress = {

	/*
	* SELECTORS
	*/

	isStarting: createSelector(getProgress, progress => progress.get('starting')),
	isStarted: createSelector(getProgress, progress => progress.get('started')),
	getCounterValue: createSelector(getProgress, progress => progress.get('counter')),
	getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
	getStartTimer: createSelector(getProgress, progress => progress.get('startTimer')),
	getBarEndPoint: createSelector(getProgress, progress => progress.get('barEndPoint')),
	getProgressBarPercent: createSelector(getProgress, progress => progress.get('progressBarPercent')),
	getCountOfStarts: createSelector(getProgress, progress => progress.get('countOfStarts')),

	/*
	* ACTIONS
	*/

	start(value = 1) {
		return (dispatch, getState) => {
			dispatch(Progress.incCounter(value));
			const counterValue = Progress.getCounterValue(getState());
			if (counterValue > 0) {
				if (!Progress.isStarting(getState())) {
					const startTimer = setTimeout(() => {
						dispatch(Progress.setBarEnd());
						dispatch(Progress.setStarted(counterValue > 0));
					}, 100);
					if (!Progress.isStarting(getState()) && !Progress.isStarted(getState())) dispatch(Progress.setStarting(startTimer));
				}
			}
		};
	},

	stop(value = 1) {
		return (dispatch, getState) => {
			if (Progress.getCounterValue(getState()) >= value) dispatch(Progress.decCounter(value));
			if (Progress.isStarted(getState())) dispatch(Progress.incProgressBarPercent());
			const counterValue = Progress.getCounterValue(getState());
			if (counterValue == 0) {
				const stopTimer = setTimeout(() => {
					dispatch(Progress.setStarted(false, value));
				}, 100);
				dispatch(Progress.setStopTimer(stopTimer));
			} else if (counterValue === 1) {
				const stopTimer = Progress.getStopTimer(getState());
				if (stopTimer) {
					clearTimeout(stopTimer);
					dispatch(Progress.setStopTimer(0));
				}
			}
		};
	},

	setBarEnd() {
		return (dispatch, getState) => {
			dispatch ({
				type: SET_BAR_END,
				barEnd: Progress.getCounterValue(getState()),
				valueOfProgress: 100 - (Progress.getCounterValue(getState()) / Progress.getCountOfStarts(getState())) * 100
			});
		};
	},

	setStarting(timer) {
		return {
			type: SET_STARTING,
			starting: true,
			timer
		};
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

	incCounter(value) {
		return {
			type: INC_COUNTER,
			value
		};
	},

	decCounter(value) {
		return {
			type: DEC_COUNTER,
			value
		};
	},

	incProgressBarPercent() {
		return (dispatch, getState) => {
			let endPoint = Progress.getBarEndPoint(getState());
			let value = 100 - Progress.getCounterValue(getState()) / endPoint * 100;
			dispatch({ type: SET_PERCENT, value: value });
		};
	},

/*
* REDUCER
*/

	reducer(state = Immutable.fromJS({counter: 0, barEndPoint: 0, progressBarPercent: 0, countOfStarts: 0}), action) {
	  switch (action.type) {

		  case SET_STARTING:
			  return state.set('starting', action.starting).set('startTimer', action.timer);

		  case SET_STARTED:
			  let newState = state;
			  if (action.started) {
				  newState = newState.set('starting', false);
			  } else {
				  newState = newState.set('stopTimer', 0).set('barEndPoint', 0).set('progressBarPercent', 0).set('countOfStarts', 0);
			  }
			  return newState.set('started', action.started).set('startTimer', undefined);

		  case SET_STOP_TIMER:
			  return state.set('stopTimer', action.stopTimer);

		  case INC_COUNTER:
			  return state.updateIn(['counter'], x => x + action.value).updateIn(['countOfStarts'], x => x + action.value);

		  case DEC_COUNTER:
			  return state.updateIn(['counter'], x => {
					let val = 0;
					x > 0 ? val = x - action.value : val;
					return val;
				});

			case SET_PERCENT:
				return state.set('progressBarPercent', action.value);

			case SET_BAR_END:
				return state.set('barEndPoint', action.barEnd).set('progressBarPercent', action.valueOfProgress);

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
