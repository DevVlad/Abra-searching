import Immutable from 'immutable';
import { createSelector } from 'reselect';


const SET_PROGRESS = 'SET_PROGRESS';

const getProgressState = (state) => state.getIn(['progress', 'counter']);

const Progress = {

	/*
	* ACTIONS
	*/
	setProgress(num) {
		return {
			type: SET_PROGRESS,
			num
		};
	},

	/*
	* REDUCER
	*/
	reducer(state = Immutable.fromJS({counter: 0}), action) {
	  switch (action.type) {

	    case SET_PROGRESS:
	      let counter = state.get('counter');
	      if (action.num) {
	        return state.set('counter', counter+1);
	      } else if (counter > 0) {
	        return state.set('counter', counter-1);
	      }

	    default:
	      return state;
	  }
	},

	getOwnState(state) {
		return {
			counter: getProgress(state)
		};
	}

};

const getProgress = createSelector(getProgressState, x => x);

export default Progress;
