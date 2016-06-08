import { createSelector } from 'reselect';

const getFilterState = (state) => state.get('filter').get('filter');
const getHintState = (state) => state.get('filter').get('hint');
const getLoadingState = (state) => state.get('loading').get('loading');

const getFilterSelector = (state) => state.get('filter');
const getLoadingSelector = (state) => state.get('loading');

export const stateSelector = (state) => {
	return {
		filter: getFilter(state),
		hint: getHint(state),
		loading: getLoading(state)
	};
};

export const getFilter = createSelector(getFilterSelector, x => x.get('filter'));
export const getHint = createSelector(getFilterSelector, x => x.get('hint'));
export const getLoading = createSelector(getLoadingSelector, x => {
	console.log('Loading selector fired');
	return x.get('loading');
});
