import Immutable from 'immutable';
import combineImmutableReducers from './combineImmutableReducers.jsx';

const initialStateFilter = Immutable.fromJS(
  {
    filter: '',
    hint: []
  }
);

function reducerFilter(state = initialStateFilter, action) {
    switch (action.type) {
      case 'INIT':
        return state.set('filter', action.filter).set('hint', Immutable.fromJS([]));

      case 'ADD_HINT':
        return state.updateIn(['hint'], list => list.concat(Immutable.fromJS(action.hint)));

      default:
        return state;
    }
}

const initialStateLoading = Immutable.fromJS(
  {
    loading: false
  }
);

function reducerLoading(state = initialStateLoading, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return state.set('loading', action.loading);

    default:
      return state;
  }
}

const reducer = combineImmutableReducers(
  {
    filterState: reducerFilter,
    loading: reducerLoading
  } 
);

function getFilterSelector(state) {
	return state.get('filterState');
}

export function getHint(state) {
	return getFilterSelector(state).get('hint');
}

export function getFilter(state) {
	return getFilterSelector(state).get('filter');
}

export function getLoading(iState) {
	return iState.getIn(['loading', 'loading']);
}

export default reducer;