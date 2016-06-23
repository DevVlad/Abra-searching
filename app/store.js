import reducer from './reducers/reducer.jsx';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

// const store = createStore(reducer, applyMiddleware(thunk));
const store = createStore(reducer, compose(
	applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f
));


store.subscribe(() => {
	// console.log('--------------------------------------------------------------');
	// console.log(store.getState().toJS());
});

export default store;
