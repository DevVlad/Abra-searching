import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import invariant from 'redux-immutable-state-invariant';

import DropdownField from './ducks/DropdownField.jsx';
import testValue from './ducks/testValueDuck.js';
import combineImmutableReducers from './combineImmutableReducers.jsx';


const reducer = combineImmutableReducers(
  {
    filter: DropdownField.reducer,
	test: testValue.reducer
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
