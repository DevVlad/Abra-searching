import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

import reducerFilter from './ducks/dropDownContact.jsx';
import combineImmutableReducers from './combineImmutableReducers.jsx';

const reducer = combineImmutableReducers(
  {
    filter: reducerFilter//,
    // progress: reducerProgress
  }
);

const store = createStore(reducer, compose(
	applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

// store.subscribe(() => {
	// console.log('--------------------------------------------------------------');
	// console.log(store.getState().toJS());
// });

export default store;
