/**
 * Created by mase on 29.6.16.
 */
import Immutable from 'immutable';
import { createSelector } from 'reselect';

const SET_TEST_ID = 'SET_TEST_ID';

const initialState = Immutable.fromJS({});

const getOwnState = (state) => state.get('test');

const getTestId = createSelector(getOwnState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('testId');
	};
});

const testValueDuck = {

	reducer(state = initialState, action) {
		switch (action.type) {
			case SET_TEST_ID:
				return state.set(action.name, action.value);
			default:
				return state;
		};
	},

	setTestId(name, value) {
		return {
			type: SET_TEST_ID,
			name,
			value
		};
	},

	getTestState(state) {
		return  getTestId(state)
	}

};

export default testValueDuck;
