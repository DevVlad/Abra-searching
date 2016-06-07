import { createSelector } from 'reselect';

const getFilterSelector = state => state.get('filter');
const getLoadingSelector = state => state.get('loading');

export const getFilter = createSelector(getFilterSelector, x => {
	console.log('zmena');
	return x.get('filter');
});
export const getHint = createSelector(getFilterSelector, x => {
	console.log('zmena');
	return x.get('hint');
});
export const getLoading = createSelector(getLoadingSelector, x => {
	console.log('zmena');
	return x.get('loading');
})