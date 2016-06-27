import Immutable from 'immutable';

/*
* ACTIONS
*/
const SET_PROGRESS = 'SET_PROGRESS';

export function setProgress(bool) {
	return {
		type: 'SET_PROGRESS',
		bool
	}
};

/*
* REDUCER
*/

const initialState = Immutable.fromJS({counter: 0});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case SET_PROGRESS:
      let counter = state.get('counter');
      if (action.bool) {
        return state.set('counter', counter+1);
      } else if (counter > 0) {
        return state.set('counter', counter-1);
      }

    default:
      return state;
  }
};
