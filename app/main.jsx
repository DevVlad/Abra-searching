import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import App from './components/App.jsx';
import Pokus from './components/pokus.jsx';
import store from './store.js';

ReactDOM.render(
	<Provider store={store}>
		<Pokus />
	</Provider>,
	document.body.appendChild(document.createElement('div'))
);
