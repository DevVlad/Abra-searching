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
		return (dispatch, getState) => {
			let toNotice = [];
			const timeID = setTimeout( () => {
				if (bool !== getProgress(getState())) {
					dispatch(setCurrentState(bool));
				};

			}, 100);
			timesBin.push(timeID);

			if(progressBin[progressBin.length-2] === bool) {
				clearTimeout(timesBin[progressBin.length-1]);
				timesBin[progressBin.length-1] = 0;
			} else if(progressBin[progressBin.length-3] === bool) {
				clearTimeout(timesBin[progressBin.length-2]);
				timesBin[progressBin.length-2] = 0;
			}
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

let progressBin = [];
let timesBin = [];
let counter = 0;

const getProgress = createSelector(getProgressState, x => x);

export default Progress;
