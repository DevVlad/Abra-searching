const initialState = {
	filter: '',
	hint: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
	  case 'INIT':
	  return {
		  ...state,
		  filter: action.filter,
		  hint: []
	  };

	  case 'ADD_HINT':
		  return {
			  ...state,
			  hint: state.hint.concat(action.hint)
		  };

    // case 'SET_LOADING':
    //   return Object.assign({}, state, {type: action.type, hint: action.hint});//{...state, type: action.type};
    //
    // case 'SET_LOADED':
    //   return Object.assign({}, state, {type: action.type, completed: true});//{...state, ...{type: action.type, completed: true}};
    //
    default:
      return state;
  }
}
