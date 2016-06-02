import ApiService from '../services/apiservice.js';

export function setFilter(filter) {
	return dispatch => {
		dispatch(init(filter));
		if (filter !== '') {
			dispatch(doRequest(filter, 0));
		}
	}
}

export function init(filter) {
	return {
		type: 'INIT',
		filter
	}
}

const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];

export function doRequest(filter, paging = 0) {
	return dispatch => {
		ApiService.getRequest({ 'add-row-count': true, 'start': paging, 'limit': 20 },
			fields.map(f => `${f} like similar '${filter}'`).join(' or ')
		).then(data => {
			dispatch(processRequest(data.winstrom, filter, paging));
		});
	}
}

export function processRequest(data, filter, paging) {
	return (dispatch, getState) => {
		if (data.kontakt.length > 0 && getState().filter === filter) {
			console.log('Applying the filter...');
			const expr = new RegExp('\\b' + filter.split(' ').map(exp => '(' + exp + ')').join('.*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			dispatch(addHint(list));
			const count = paging + data.kontakt.length;
			const totalCount = parseInt(data['@rowCount']);
			const hintCount = getState().hint.length;
			if (totalCount > count && hintCount < 10) {
				dispatch(doRequest(filter, paging + data.kontakt.length));
			}
		}
	}
}

export function addHint(list) {
	return {
		type: 'ADD_HINT',
		hint: list
	}
}

// export const setLoading = () => {
// 	return {
// 		type: 'SET_LOADING',
// 		hint: []
// 	}
// }
//
// export const setLoaded = () => {
// 	return {
// 		type: 'SET_LOADED'
// 	}
// }


