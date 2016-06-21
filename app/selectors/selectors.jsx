import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getFilterSelector = (state) => state.get('filter');
const getLoadingSelector = (state) => state.get('loading');

export const stateSelectorListAlias = (state, props) => {
	return {
		filter: getFilter(state),
		hint: getHint(state),
		loading: getLoading(state)
	};
}

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
