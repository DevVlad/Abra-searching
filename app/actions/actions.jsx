import ApiService from '../services/apiservice.js';
import { getFilter, getHint } from '../selectors/selectors.jsx';
import Immutable from 'immutable'

export function setFilter(filter) {
	return dispatch => {
		dispatch(init(filter));
		dispatch(setLoading(false));
		if (filter !== '') {
			dispatch(setLoading(true));
			dispatch(doRequest(filter, 0));
		}
	}
}

function init(filter) {
	return {
		type: 'INIT',
		filter
	}
}

function setLoading(loading) {
	return {
		type: 'SET_LOADING',
		loading
	}
}

const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];

function doRequest(filter, paging = 0) {
	// console.log('Sending request for paging ' + paging + ' and filter ' + filter);
	return dispatch => {
		ApiService.getRequest({ 'add-row-count': true, 'start': paging, 'limit': 20 },
			fields.map(f => `${f} like similar '${filter}'`).join(' or ')
		).then(data => {
			dispatch(processRequest(data.winstrom, filter, paging));
		});
	}
}

function processRequest(data, filter, paging) {
	return (dispatch, getState) => {
		if (data.kontakt.length > 0 && getFilter(getState()) === filter) {
			// console.log('Applying the filter...');
			const expr = new RegExp('\\b' + filter.split(' ').map(exp => '(' + exp + ')').join('.*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			dispatch(setLimit(list));
			const count = paging + data.kontakt.length;
			const totalCount = parseInt(data['@rowCount']);
			const hintCount = getHint(getState()).size;
			if (totalCount > count && hintCount < 10) {
				dispatch(doRequest(filter, paging + data.kontakt.length));
			}
		}
	}
}

function addHint(list) {
	// console.log('Add hints to list...');
	return {
		type: 'ADD_HINT',
		hint: list
	}
}

function setLimit(list) {
	return (dispatch, getState) => {
		const counter = getHint(getState()).size;
		const dif = 10 - counter;
		if (list.length > dif) {
			const partOfLIst = list.slice(0,-(list.length-dif));
			dispatch(setLoading(false)); // console.log('setL false')
			dispatch(addHint(partOfLIst));
		} else if (list.length <= dif) {
			dispatch(setLoading(false));	// console.log('setL false')
			dispatch(addHint(list));
		}
	}
}
