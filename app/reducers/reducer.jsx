import Immutable from 'immutable';
import combineImmutableReducers from './combineImmutableReducers.jsx';

const initialStateFilter = Immutable.fromJS(
  {
    filter: '',
    hint: []
  }
);

function reducerFilter(state = initialStateFilter, action) {
    let obj = {};
    obj[action.alias] = {filter: '', hint: [], loading: false};
    obj = Immutable.fromJS(obj);
    switch (action.type) {
      case 'INIT':
        obj = obj.setIn([action.alias, 'filter'], action.filter);
        console.log('+++++++++++++++++++', obj.toJS())
        return state.set('filter', action.filter);

      case 'SET_HINT':
        obj = obj.setIn([action.alias, 'hint'], Immutable.fromJS(action.hint));
        return state.updateIn(['hint'], list => Immutable.fromJS(action.hint));

      case 'ADD_HINT':
        obj = obj.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint)));
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
      let obj = {};
      obj[action.alias] = {filter: '', hint: [], loading: false};
      obj = Immutable.fromJS(obj);
      obj = obj.updateIn([action.alias, 'loading'], loading => action.loading);
      return state.set('loading', action.loading);

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
