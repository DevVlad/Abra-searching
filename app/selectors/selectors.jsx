import { createSelector } from 'reselect';

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
}

export const getFilter = createSelector(getFilterSelector, x => x.get('filter'));
export const getHint = createSelector(getFilterSelector, x => x.get('hint'));
export const getLoading = createSelector(getLoadingSelector, x => x.get('loading'));
