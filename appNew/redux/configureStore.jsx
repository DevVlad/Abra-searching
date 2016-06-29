import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

import * as DropdownField from './ducks/dropdownfield.jsx';
import testValue from './ducks/testValueDuck.js';
import combineImmutableReducers from './combineImmutableReducers.jsx';


const reducer = combineImmutableReducers(
  {
    filter: DropdownField.reducer,
	testValue: testValue.reducer
  }
);

const store = createStore(reducer, compose(
	applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

store.subscribe(() => {
	console.log('--------------------------------------------------------------');
	console.log(store.getState().toJS());
});

export default store;
