import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import invariant from 'redux-immutable-state-invariant';

import DropdownFieldOld from './ducks/dropdownfieldold.jsx';
import testValue from './ducks/testValueDuck.js';
import combineImmutableReducers from './combineImmutableReducers.jsx';
import Progress from './ducks/progress.jsx';
import DropdownFieldDuck from './ducks/dropdownfieldDuck.jsx';


const reducer = combineImmutableReducers(
  {
    filter: DropdownFieldOld.reducer,
	  test: testValue.reducer,
    progress: Progress.reducer,
    dropdown: DropdownFieldDuck.reducer
  }
);

const store = createStore(reducer, compose(
	applyMiddleware(invariant(), thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// store.subscribe(() => {
// 	console.log('--------------------------------------------------------------');
// 	console.log(store.getState().toJS());
// });

export default store;
