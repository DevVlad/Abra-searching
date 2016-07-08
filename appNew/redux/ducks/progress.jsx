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
		progressBin.push(bool);
		if (bool) {
			counter = counter + 1;
		} else {
			counter = counter - 1;
		}
		return (dispatch, getState) => {
			const timeID = setTimeout( () => {
				if(progressBin[progressBin.length-3] === bool) {
					clearTimeout(timeouts.length-3);
					clearTimeout(timeouts.length-2);
				}
				if(progressBin[progressBin.length-2] === bool) {
					bool ? clearTimeout(timeouts.length-2) : clearTimeout(timeouts.length-1);
				}
			}, 1000);
			timeouts.push(timeID);
			console.log(counter)
			if (counter > 0 && !getProgress(getState()) || getProgress(getState()) === undefined) {
				console.log(progressBin)
					dispatch(setCurrentState(true));
			} else if(counter === 0) dispatch(setCurrentState(false));
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
