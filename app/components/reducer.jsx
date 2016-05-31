
let resetList = (state) => {
  //probehne reset vsech dat - novy nulovy store
  return console.log('....');
}

let addList = (state) => {
  //prida do listu polozky co uz nasel v soft filteru a pokracuje dal - vola se po probehnuti thunku, kdyz vrati data
  return console.log('....');
}

let setLoaded = (state) => {
  //kdyz dobehne hledani a probehne zobrazeni, aktualizace stavu na setLoaded
  return console.log('....');
}

let setLoading = (state) => {
  //jakmile se spusti setFilter, aktualizace typu a setLoading
  return console.log('....');
}

let setFilter = (state) => {
  //spousti thunk
  state.type = state.type.slice(state.type.length).concat('SET_FILTER');
  return ( 
    console.log(state)
  )
}

let setState = (state, newState) => {
  return (
    state = {...newState, ...state}
  );
}

export default (state = 0, action) => {
  switch (action.type) {
    case 'SET_STATE':
     return setState(state, action);
    case 'SET_FILTER':
     return setFilter(state);
    case 'SET_LOADING':
     return setLoading(state);
    case 'SET_LOADED':
     return setLoaded(state);
    case 'ADD_LIST':
      return addList(state);
    case 'RESET_LIST':
       return resetList(state);
    default:
       return state;
  }
}
