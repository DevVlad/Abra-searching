import { createSelector } from 'reselect';

const getFilterSelector = (state) => state.get('filter');
const getLoadingSelector = (state) => state.get('loading');

export const stateSelectorList = (state) => {
	console.log('selectorFilter');
	return {
		filter: getFilter(state),
		hint: getHint(state),
	};
};

export const stateSelectorLoading = (state) => {
	console.log('selectorLoading');
	return {
		loading: getLoading(state)
	}
}

export const getFilter = createSelector(getFilterSelector, x => {
		console.log('filter selector fired');
		return x.get('filter');
});
export const getHint = createSelector(getFilterSelector, x => {
		console.log('hint selector fired');
		return x.get('hint');
});
export const getLoading = createSelector(getLoadingSelector, x => {
	console.log('Loading selector fired');
	return x.get('loading');
});
