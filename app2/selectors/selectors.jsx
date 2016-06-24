import { createSelector } from 'reselect';
import Immutable from 'immutable';

export const selectorAll = (state) => state.toJS();

const getAliasF = (state, alias) => state.getIn(['filter', alias]);
const getProgressState = (state) => state.getIn(['progress', 'counter']);

export const stateSelectorListAlias = (state, alias) => {
	let obj = {};
	obj[alias] = {
		filter: getFilterAlias(state, alias),
		hint: getHintAlias(state, alias),
		loading: getLoadingAlias(state, alias)
	};
	return obj;
};

export const stateSelectorFirstRecordAlias = (state, alias) => {
	return {
		filter: getFilterAlias(state, alias),
		firstRecord: getFirstRecord(state, alias)
	}
};

export const stateSelectorProgress = (state) => {
	return {
		counter: getProgress(state)
	}
};

export const getFirstRecord = createSelector(getAliasF, x => {
	if (x === undefined || x.get('hint').size === 0) {
		return Immutable.fromJS({});
	} else {
		return x.get('hint').first();
	}
});

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

export const getProgress = createSelector(getProgressState, x => x);
