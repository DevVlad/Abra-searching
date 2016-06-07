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
        let stateInit = state.updateIn(['filter'], x => action.filter);
        stateInit = stateInit.updateIn(['hint'], x => Immutable.fromJS([]));
        return stateInit;

      case 'ADD_HINT':
        let stateAddHint = state.updateIn(['hint'], list => list.concat(Immutable.fromJS(action.hint)));
        return stateAddHint;

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
      let stateLoading = state.updateIn(['loading'], x => action.loading);
      return stateLoading;
    default:
      return state;
  }
}

const reducer = combineImmutableReducers(
  {
    filter: reducerFilter,
    loading: reducerLoading
  } 
);

export default reducer;