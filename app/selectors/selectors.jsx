import { createSelector } from 'reselect';

const getFilterSelector = state => state.get('filter');
const getLoadingSelector = state => state.get('loading');

export const getFilter = createSelector(getFilterSelector, x => {
	console.log('zmena filter');
	return x.get('filter');
});
export const getHint = createSelector(getFilterSelector, x => {
	console.log('zmena hint');
	return x.get('hint');
});
export const getLoading = createSelector(getLoadingSelector, x => {
	console.log('zmena loading');
	return x.get('loading');
})