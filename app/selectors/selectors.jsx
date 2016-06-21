import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getAliasSelectorFilter = (state, props) => state.getIn([props.alias, 'filter']);
const getAliasSelectorLoading = (state, props) => state.getIn([props.alias, 'loading']);

export const getFilterAlias = createSelector(getAliasSelectorFilter, x => x.get('filter'));
export const getHintAlias = createSelector(getAliasSelectorFilter, x => x.get('hint'));
export const getLoadingAlias = createSelector(getAliasSelectorLoading, x => x.get('loading'));


const getFilterSelector = (state) => state.get('filter');
const getLoadingSelector = (state) => state.get('loading');

export const stateSelectorList = (state) => {
	return {
		filter: getFilter(state),
		hint: getHint(state),
	};
};

export const stateSelectorLoading = (state) => {
	return {
		loading: getLoading(state)
	};
};

export const stateSelectorFirstRecord = (state) => {
	return {
		filter: getFilter(state),
		hint: getFirstRecord(state)
	};
};

export const getFilter = createSelector(getFilterSelector, x => x.get('filter'));
export const getHint = createSelector(getFilterSelector, x => x.get('hint'));
export const getLoading = createSelector(getLoadingSelector, x => x.get('loading'));
export const getFirstRecord = createSelector(getFilterSelector, x => {
	if ( x.get('hint').size > 0) {
		return x.get('hint').first();
	} else return Immutable.fromJS({});
});
