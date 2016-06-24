import Immutable from 'immutable';

export default function combineImmutableReducers(reducers) {
	reducers = Immutable.fromJS(reducers);
	let stateDef = reducers.map(red => undefined);
	return function combination(state = stateDef, action) {
		let stateFinal = state;
		reducers.forEach((reducer, key) => {
			const stateOfReducer = state.get(key);
			const newState = reducer(stateOfReducer, action);
			if (stateOfReducer !== newState) {
				stateFinal = stateFinal.set(key, newState);
			}
		});
		return stateFinal;
	}
}
