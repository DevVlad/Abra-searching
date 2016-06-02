import { setInit } from '../actions/actions.jsx'

const reducer = (state = setInit(), action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return Object.assign({}, state, {type: action.type, input: action.input, completed: false}); //{...state, ...{type: action.type, input: action.input, completed: false}};

    case 'SET_LOADING':
      return Object.assign({}, state, {type: action.type, hint: action.hint});//{...state, type: action.type};

    case 'SET_LOADED':
      return Object.assign({}, state, {type: action.type, completed: true});//{...state, ...{type: action.type, completed: true}};

    case 'ADD_HINT':
    let pom = [...state.hint, ...action.hint];
      return Object.assign({}, state, {hint: pom, type: action.type});//{...state, ...{hint: action.hint, type: action.type}};

    case 'SET_INITIAL_STATE':
      let newState = setInit();
      return Object.assign({}, state, newState);//{...state, ...newState};
    
    default:
      return state;
  }
}

export default reducer;