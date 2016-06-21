import Immutable from 'immutable';
import combineImmutableReducers from './combineImmutableReducers.jsx';

const initialStateFilter = Immutable.fromJS(
  {
    filter: '',
    hint: []
  }
);

// function initialStateFilter(alias) {
//   let obj = {};
//   obj[alias] = {filter: '', hint: []};
//   return obj;
// }

function reducerFilter(state = initialStateFilter, action) {
    switch (action.type) {

      case 'INIT':
      console.log('init', state.setIn([action.alias, 'filter'], action.filter).toJS())
        return state.setIn([action.alias, 'filter'], action.filter);

      case 'SET_HINT':
      console.log('setHint', state.setIn([action.alias, 'hint'], list => Immutable.fromJS(action.hint)).toJS())
		    return state.setIn([action.alias, 'hint'], list => Immutable.fromJS(action.hint));

      case 'ADD_HINT':
      console.log('setHint', state.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint))).toJS())
        return state.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint)));

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
  // {
  //   reducerFilter,
  //   reducerLoading
  // }
);

export default reducer;
