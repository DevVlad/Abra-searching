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
		if (bool) {
			counter = counter + 1;
		} else {
			counter = counter - 1;
		}
		progressBin.push(bool);
		return (dispatch, getState) => {
			const timeID = setTimeout( () => {
					if (counter > 0 && !getProgress(getState()) || getProgress(getState()) === undefined) {
						dispatch(setCurrentState(true));
					} else if(counter === 0) dispatch(setCurrentState(false));
				}, 100);
				timeouts.push(timeID);
				if (progressBin && bool === progressBin[progressBin.length-2]) {
					console.log(progressBin[progressBin.length-2], progressBin)
					clearTimeout(progressBin.length-2);
				}

			// let promise = new Promise((res) => {
			// 	const timeID = setTimeout( () => {
			// 		res(timeID,counter, progressBin, bool, timeouts, getProgress(getState()))
			// 	}, 1500);
			// 	timeouts.push(timeID);
			// 	console.log('insideofpromise', timeouts)
			// });
			// promise.then((res) => {
			// 	console.log('after timeout', res,counter, progressBin, bool, timeouts)
			//
			// });
		};
	},

	/*
	* REDUCER
	*/

	reducer(state = Immutable.fromJS({loading: false}), action) {
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
