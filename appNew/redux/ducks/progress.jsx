import Immutable from 'immutable';
import { createSelector } from 'reselect';

const SET_STARTING = 'SET_STARTING';
const SET_STARTED = 'SET_STARTED';
const SET_STOP_TIMER = 'SET_STOP_TIMER';
const INC_COUNTER = 'INC_COUNTER';
const DEC_COUNTER = 'DEC_COUNTER';

const getProgress = state => state.get('progress');


const Progress = {

	/*
	* SELECTORS
	*/

	isStarting: createSelector(getProgress, progress => progress.get('starting')),
	getCounter: createSelector(getProgress, progress => progress.get('counter')),
	getStopTimer: createSelector(getProgress, progress => progress.get('stopTimer')),
	isStarted: createSelector(getProgress, progress => progress.get('started')),

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

/*
* REDUCER
*/

	reducer(state = Immutable.fromJS({counter: 0}), action) {
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

		  case INC_COUNTER:
				// return state.set('counter', action.counter + 1);
			  return state.updateIn(['counter'], counter => counter + 1);

		  case DEC_COUNTER:
				// return state.set('counter', action.counter - 1);
			  return state.updateIn(['counter'], counter => counter - 1);

		  default:
	        return state;
	  }
	}

};

export default Progress;
