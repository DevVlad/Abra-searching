import { createSelector } from 'reselect';
import Immutable from 'immutable';

export const selectorAll = (state) => state.toJS();

const getAliasF = (state, alias) => state.getIn(['filter', alias]);
const getProgress = (state) => state.getIn(['progress', 'counter']);

export const stateSelectorListAlias = (state, alias) => {
	let obj = {};
	obj[alias] = {
		filter: getFilterAlias(state, alias),
		hint: getHintAlias(state, alias),
		loading: getLoadingAlias(state, alias)
	};
	return obj;
};

export const stateSelectorProgress = (state) => {
	return {
		counter: getProgress(state)
	}
};

export const getFilterAlias = createSelector(getAliasF, x => {
	if (x === undefined) {
		return '';
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

export const getLoadingAlias = createSelector(getAliasF, x => {
	if (x === undefined) {
		return false;
	} else {
		return x.get('loading');
	}
});
