import reducer from './reducers/reducer.jsx';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunk));

store.subscribe(() => {
	console.log('--------------------------------');
	console.log(store.getState());
});

export default store;
