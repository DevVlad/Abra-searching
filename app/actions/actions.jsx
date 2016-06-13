import ApiService from '../services/apiservice.js';
import { getFilter, getHint, getLoading } from '../selectors/selectors.jsx';

export function setFilter(filter) {
	return dispatch => {
		dispatch(init(filter));
		dispatch(setLoading(false));
		if (filter !== '') {
			dispatch(setLoading(true));
			dispatch(doRequest(filter, 0));
		}
		if (filter === '') dispatch(setHint([]));
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
	return dispatch => {
		ApiService.getRequest({ 'add-row-count': true, 'start': paging, 'limit': 20 },
			fields.map(f => `${f} like similar '${filter}'`).join(' or ')
		).then(data => {
			setTimeout(() => {
					dispatch(processRequest(data.winstrom, filter, paging));
			}, 0);
		});
	}
}

function processRequest(data, filter, paging) {
	return (dispatch, getState) => {
		if (getFilter(getState()) === filter) {
			const expr = new RegExp('\\b' + filter.split(' ').map(exp => '(' + exp + ')').join('.*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			const totalCount = parseInt(data['@rowCount']);
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(setLoading(false));
				dispatch(setHint([]));
			} else {
					dispatch(setLimit(list));
					const count = paging + data.kontakt.length;
					const hintCount = getHint(getState()).size;
					if (totalCount > count && hintCount < 10) {
						dispatch(doRequest(filter, count));
					}
			}
		}
	}
}

function addHint(list) {
	return {
		type: 'ADD_HINT',
		hint: list
	}
}

function setHint(list) {
	return {
		type: 'SET_HINT',
		hint: list
	}
}


function setLimit(list) {
	let pom = 0;
	return (dispatch, getState) => {
		let counter = getHint(getState()).size;
		let loading = getLoading(getState());
		if (loading) {
			counter = 0;
		}
		const dif = 10 - counter;
		if (list.length > dif) {
			const partOfList = list.slice(0, -(list.length-dif));
			pom = partOfList;
		} else if (list.length <= dif) {
			pom = list;
		}
		if (loading) {
			dispatch(setLoading(false));
			dispatch(setHint(pom));
		} else {
			dispatch(addHint(pom));
		}
	}
}
