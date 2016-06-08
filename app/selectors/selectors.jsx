import { createSelector } from 'reselect';

const getFilterState = (state) => state.get('filter').get('filter');
const getHintState = (state) => state.get('filter').get('hint');
const getLoadingState = (state) => state.get('loading').get('loading');

export const stateSelector = createSelector(
	[ getFilterState, getHintState, getLoadingState ],
	(filter, hint , loading) => {
		console.log('selector ', filter, hint.toJS(), loading);
		return {
			filter: filter,
			hint: hint,
			loading: loading
		}
	}
);


const getFilterSelector = (state) => state.get('filter');
const getLoadingSelector = (state) => state.get('loading');

export const getFilter = createSelector(getFilterSelector, x => x.get('filter'));
export const getHint = createSelector(getFilterSelector, x => x.get('hint'));
export const getLoading = createSelector(getLoadingSelector, x => x.get('loading'));
