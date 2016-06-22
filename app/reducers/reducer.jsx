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

      case 'SET_LOADING':
        return state.setIn([action.alias, 'loading'], action.loading);

      default:
        return state;
    }
};

const initialStateLoading = Immutable.fromJS({counter: 0});

function reducerProgress(state = initialStateLoading, action) {
  switch (action.type) {
    case 'SET_PROGRESS':
      let counter = state.get('counter');
      console.log('setprogressreducer')
      if (action.bool) {
        return state.set('counter', counter+1);
      } else if (counter > 0) {
        return state.set('counter', counter-1);
      } else {
        return state.set('counter', 0);
      }

    default:
      return state;
  }
};

const reducer = combineImmutableReducers(
  {
    filter: reducerFilter,
    progress: reducerProgress
  }
);

export default reducer;
