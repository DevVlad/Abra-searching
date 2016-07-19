/**
 * Created by mase on 29.6.16.
 */
import Immutable from 'immutable';
import { createSelector } from 'reselect';

const SET_TEST_ID = 'SET_TEST_ID';
const SET_VALUE = 'SET_VALUE';

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
			case SET_VALUE:
				return state.set(action.alias, action.text);
			default:
				return state;
		};
	},

	setValue(alias, text) {
		return {
			type: SET_VALUE,
			text,
			alias
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
	},

	getValueFroSelectField: createSelector(getOwnState, x => {
		if (x === undefined) {
			return undefined;
		} else {
			return x.get('textForSelectField');
		};
	}),

	getValueOfCheckbox: createSelector(getOwnState, x => {
		if (x === undefined) {
			return undefined;
		} else {
			return x.get('checkbox');
		};
	}),

};

export default testValueDuck;
