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

    case 'SET_LOADING':
      return {
        ...state, 
        loading: action.loading
      };

    default:
      return state;
  }
}
