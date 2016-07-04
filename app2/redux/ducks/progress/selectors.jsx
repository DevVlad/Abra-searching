import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getProgressState = (state) => state.getIn(['progress', 'counter']);

export const stateSelectorProgress = (state) => {
	return {
		counter: getProgress(state)
	}
};

export const getProgress = createSelector(getProgressState, x => x);
