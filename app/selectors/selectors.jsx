import { createSelector } from 'reselect';
import Immutable from 'immutable';

export const selectorAll = (state) => state.toJS();

const getAliasF = (state, alias) => state.getIn(['filter', alias]);
const getAliasL = (state, alias) => state.getIn(['loading', alias]);
//
export const stateSelectorListAlias = (state, alias) => {
	let obj = {};
	obj[alias] = {
		filter: getFilterAlias(state, alias),
		hint: getHintAlias(state, alias)
	};
	return obj;
};

export const stateSelectorLoadingAlias = (state, props) => {
	return {
		loading: getLoadingAlias(state, props)
	};
};

export const getFilterAlias = createSelector(getAliasF, x => {
	if (x === undefined) {
		return 'init';
	} else {
		return x.get('filter');
	}
});
export const getHintAlias = createSelector(getAliasF, x => {
	if (x === undefined) {
		return Immutable.fromJS([]);
	} else {
		return x.get('hint');
	}
});
export const getLoadingAlias = createSelector(getAliasL, x => {
	if (x === undefined) {
		return false;
	} else {
		return x.get('loading');
	}
});



// const getFilterSelector = (state) => state.get('filter');
// const getLoadingSelector = (state) => state.get('loading');
//
// export const stateSelectorList = (state) => {
// 	return {
// 		filter: getFilter(state),
// 		hint: getHint(state)
// 	};
// };
//
// export const stateSelectorLoading = (state) => {
// 	return {
// 		loading: getLoading(state)
// 	};
// };
//
// export const stateSelectorFirstRecord = (state) => {
// 	return {
// 		filter: getFilter(state),
// 		hint: getFirstRecord(state)
// 	};
// };
//
// export const getFilter = createSelector(getFilterSelector, x => x.get('filter'));
// export const getHint = createSelector(getFilterSelector, x => x.get('hint'));
// export const getLoading = createSelector(getLoadingSelector, x => x.get('loading'));
// export const getFirstRecord = createSelector(getFilterSelector, x => {
// 	if ( x.get('hint').size > 0) {
// 		return x.get('hint').first();
// 	} else return Immutable.fromJS({});
// });
