import Immutable from 'immutable';
import { createSelector } from 'reselect';


const SET_PROGRESS = 'SET_PROGRESS';

const getProgressState = (state) => state.getIn(['progress', 'counter']);

const Progress = {

	/*
	* ACTIONS
	*/
	setProgress(bool) {
		return {
			type: SET_PROGRESS,
			bool
		};
	},

	/*
	* REDUCER
	*/
	reducer(state = Immutable.fromJS({counter: 0}), action) {
	  switch (action.type) {

	    case SET_PROGRESS:
				// const debounced = _.debounce(() => {
				// 	let counter = state.get('counter');
				// 	if (action.num) {
		    //     return state.set('counter', counter+1);
		    //   } else if (counter > 0) {
		    //     return state.set('counter', counter-1);
		    //   }
				// }, 50);
				// debounced()
	      let counter = state.get('counter');
	      if (action.bool) {
	        return state.set('counter', counter + 1);
	      } else {
					const debounced = _.debounce(() => {
						let val = counter;
						if(val === counter) return state.set('counter', counter - 1);
				 	}, 100);
					return debounced();
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
