import reducer from './reducers/reducer.jsx';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Immutable from 'immutable';

const store = createStore(reducer, applyMiddleware(thunk));

store.subscribe(() => {
	console.log('--------------------------------');
	console.log(store.getState().toJS());
});

export default store;
