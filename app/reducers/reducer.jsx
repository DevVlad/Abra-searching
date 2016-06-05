import Immutable from 'immutable';

const initialState = Immutable.fromJS(
  { 
    filter: '',
    hint: []
  }
);

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INIT':
      let stateInit = state.updateIn(['filter'], x => Immutable.fromJS(action.filter));
      stateInit = stateInit.updateIn(['hint'], x => Immutable.fromJS([]));
      return stateInit;

    case 'ADD_HINT':
      let stateAddHint = state.updateIn(['hint'], list => list.concat(Immutable.fromJS(action.hint)));
      return stateAddHint;

    case 'SET_LOADING':
      let stateLoading = state.updateIn(['loading'], x => Immutable.fromJS(action.loading));
      return stateLoading;

    default:
      return state;
  }
}
// const initialState = {
// 	filter: '',
// 	hint: []
// };

// export default function reducer(state = initialState, action) {
//   switch (action.type) {
// 	  case 'INIT':
//   	  return {
//   		  ...state,
//   		  filter: action.filter,
//   		  hint: []
//   	  };

// 	  case 'ADD_HINT':
// 		  return {
// 			  ...state,
// 			  hint: state.hint.concat(action.hint)
// 		  };

//     case 'SET_LOADING':
//       return {
//         ...state, 
//         loading: action.loading
//       };

//     default:
//       return state;
//   }
// }
