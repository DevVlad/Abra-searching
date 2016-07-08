import Immutable from 'immutable';
import { createSelector } from 'reselect';


const SET_PROGRESS = 'SET_PROGRESS';
function setCurrentState(bool) {
	return {
		type: SET_PROGRESS,
		bool
	};
};

const getProgressState = (state) => state.getIn(['progress', 'loading']);

const Progress = {

	/*
	* ACTIONS
	*/

	setProgress(bool) {
		console.log('prdel', timeouts, progressBin)


		if (bool) {
			counter = counter + 1;
		} else {
			counter = counter - 1;
		}
		progressBin.push(bool);
		return dispatch => {
			dispatch(setCurrentState(bool));
			let promise = new Promise((res) => {
				const timeID = setTimeout( () => {
					res(timeID)
				}, 1500);
				timeouts.push(timeID);
			});
			promise.then((result) => {
				console.log('after timeout', result, counter, progressBin, bool, timeouts)

			});
		};
	},

	/*
	* REDUCER
	*/

	reducer(state = Immutable.fromJS({}), action) {
	  switch (action.type) {

	    case SET_PROGRESS:
			return state.setIn(['loading'], action.bool);



	    default:
	      return state;
	  }
	},

	getOwnState(state) {
		return {
			progress: getProgress(state)
		};
	}

};

let timeouts = [];
let progressBin = [];
let counter = 0;

const getProgress = createSelector(getProgressState, x => x);

export default Progress;
