import { createSelector } from 'reselect';
import Immutable from 'immutable';

export const selectorAll = (state) => state.toJS();

const getAliasF = (state, alias) => state.getIn(['filter', alias]);
const getAliasL = (state, alias) => state.getIn(['loading', alias]);
const getLoadingCounter = (state) => state.getIn(['loading', 'counter']);
//
export const stateSelectorListAlias = (state, alias) => {
	let obj = {};
	obj[alias] = {
		filter: getFilterAlias(state, alias),
		hint: getHintAlias(state, alias)
	};
	return obj;
};

export const stateLoadingCounter = (state) => {
	return {
		counter: getLoadingCounter(state)
	}
};

export const stateSelectorLoadingAlias = (state, alias) => {
	return {
		loading: getLoadingAlias(state, alias),
	};
};

export const getFilterAlias = createSelector(getAliasF, x => {
	if (x === undefined) {
		return 'init';
	} else {
		return x.get('filter');
	}
});

export const getHintAlias = createSelector(getAliasF, x => {
	if (x === undefined) {
		return Immutable.fromJS([]);
	} else {
		return x.get('hint');
	}
});

export const getLoadingAlias = createSelector(getAliasL, x => {
	if (x === undefined) {
		return false;
	} else {
		return x.get('loading');
	}
});
