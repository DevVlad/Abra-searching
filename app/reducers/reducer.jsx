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

const initialStateLoading = Immutable.fromJS({counter: 0});

function reducerLoading(state = initialStateLoading, action) {
  switch (action.type) {
    case 'SET_LOADING':
      let obj = state;
      let counter = state.get('counter');
      if (action.loading === true) {
        obj = state.set('counter', counter+1);
      } else {
        if (counter > 0) obj = state.set('counter', counter-1);
      }
      return obj.setIn([action.alias, 'loading'], action.loading);

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
