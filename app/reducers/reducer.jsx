import Immutable from 'immutable';
import combineImmutableReducers from './combineImmutableReducers.jsx';

const initialStateFilter = Immutable.fromJS({

});

function reducerFilter(state = initialStateFilter, action) {
    switch (action.type) {
      case 'INIT':
        return state.setIn([action.alias, 'filter'], action.filter);;

      case 'SET_HINT':
        return state.setIn([action.alias, 'hint'], Immutable.fromJS(action.hint));

      case 'ADD_HINT':
        return state.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint)));

      default:
        return state;
    }
}

const initialStateLoading = Immutable.fromJS({});

function reducerLoading(state = initialStateLoading, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return state.setIn([action.alias, 'loading'], action.loading);

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
