/**
 * Created by mase on 29.6.16.
 */
import Immutable from 'immutable';

const SET_TEST_VALUE = 'SET_TEST_VALUE';

const initialState = Immutable.fromJS({});

const testValueDuck = {

	reducer(state = initialState, action) {
		switch (action.type) {
			case SET_TEST_VALUE:
				return state.set(action.name, action.value);
			default:
				return state;
		}
	},

	setTestValue(name, value) {
		return {
			type: SET_TEST_VALUE,
			name,
			value
		};
	},

	getTestValue(state, name) {
		return state.get(name);
	}

};

export default testValueDuck;
