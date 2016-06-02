
let addHint = (state, action) => {
  //prida do listu polozky co uz nasel v soft filteru a pokracuje dal - vola se po probehnuti thunku, kdyz vrati data
  return console.log('....');
}

let setLoaded = (state, action) => {
  //kdyz dobehne hledani a probehne zobrazeni, aktualizace stavu na setLoaded
  return console.log('....');
}

let setLoading = (state, action) => {
  //jakmile se spusti setFilter, aktualizace typu a setLoading
  let newState = {
    type: state.type.slice(state.type.length).concat(action.type)
  };
  return {...state, ...newState};
}

// let setFilter = (state, action) => {
//   //spousti thunk 
//   //testing it does something
//   let newState = {
//     type: state.type.slice(state.type.length).concat(action.type),
//     forInput: state.forInput,
//     data: state.data.slice(state.data.length).concat([0,0]),
//     hint: state.hint.slice(state.hint.length).concat([1,1])
//   };
//   return newState;
// }

let setIntState = (state, newState) => {
  let data = []; 
  let hint = [];
  newState = {...newState, data, hint};
  return  {...state, ...newState};
}

export default (state = 0, action) => {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
     return setIntState(state, action);
    // case 'SET_FILTER':
    //  return setFilter(state, action);
    case 'SET_LOADING':
     return setLoading(state, action);
    case 'SET_LOADED':
     return setLoaded(state, action);
    case 'ADD_HINT':
      return addHint(state, action);
    default:
       return state;
  }
}
