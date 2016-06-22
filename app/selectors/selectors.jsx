import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getAlias = (state, props) => state.get(props.alias);
//
export const stateSelectorListAlias = (state, props) => {
	let fakeState = Immutable.fromJS({a: {
		filter: 'ss',
		hint: [{prijmeni: 'hanakova', jmeno: 'Dana', id: 358777}]
	}});
	let obj = {};
	obj[props.alias] = {
		filter: getFilterAlias(fakeState, props),
		hint: getHintAlias(fakeState, props)
	};
	console.log('66616564', obj)
	return obj;
};
//
// export const stateSelectorLoadingAlias = (state, props) => {
// 	return {
// 		loading: getLoadingAlias(state, props)
// 	};
// };
//
export const getFilterAlias = createSelector(getAlias, x => x.get('filter'));
export const getHintAlias = createSelector(getAlias, x => x.get('hint'));
// export const getLoadingAlias = createSelector(getAlias, x => x.get('loading'));






const getFilterSelector = (state) => state.get('filter');
const getLoadingSelector = (state) => state.get('loading');

export const stateSelectorList = (state) => {
	return {
		filter: getFilter(state),
		hint: getHint(state)
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
