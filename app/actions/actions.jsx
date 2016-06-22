import ApiService from '../services/apiservice.js';
import { getFilter, getHint, getLoading, getFilterAlias, getHintAlias, getLoadingAlias } from '../selectors/selectors.jsx';

export function setFilter(filter, alias) {
	return dispatch => {
		dispatch(setHint([], alias));
		dispatch(init(filter, alias));
		dispatch(setLoading(false, alias));
		if (filter !== '') {
			dispatch(setLoading(true, alias));
			dispatch(doRequest(filter, 0, alias));
		}
		if (filter === '') dispatch(setHint([], alias));
	}
}

function init(filter, alias) {
	return {
		type: 'INIT',
		filter,
		alias
	}
}

function setLoading(loading, alias) {
	return {
		type: 'SET_LOADING',
		loading,
		alias
	}
}

const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];

function doRequest(filter, paging = 0, alias) {
	return dispatch => {
		ApiService.getRequest({ 'add-row-count': true, 'start': paging, 'limit': 20 },
			fields.map(f => `${f} like similar '${filter}'`).join(' or ')
		).then(data => {
			setTimeout(() => {
					dispatch(processRequest(data.winstrom, filter, paging, alias));
			}, 0);
		});
	}
}

function processRequest(data, filter, paging, alias) {
	return (dispatch, getState) => {
		console.log('pokus', getState().toJS(), getFilterAlias(getState(), alias))
		// if (getFilter(getState()) === filter) {
		if (getFilterAlias(getState(), alias) === filter) {
			// const expr = new RegExp('\\b' + filter.split(' ').map(exp => '(' + exp + ')').join('.*\\b'), 'i');
			const expr = new RegExp('\\b^' + filter.split(' ').map(exp => '(' + exp + ')').join('.*[a-zá-ž].*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni)// || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			const totalCount = parseInt(data['@rowCount']);
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(setLoading(false, alias));
				dispatch(setHint([], alias));
			} else {
					dispatch(setLimit(list, alias));
					const count = paging + data.kontakt.length;
					const hintCount = getHintAlias(getState(), alias).size;
					if (totalCount > count && hintCount < 10) {
						dispatch(doRequest(filter, count, alias));
					}
			}
		}
	}
}

function addHint(list, alias) {
	return {
		type: 'ADD_HINT',
		hint: list,
		alias
	}
}

function setHint(list, alias) {
	return {
		type: 'SET_HINT',
		hint: list,
		alias
	}
}


function setLimit(list, alias) {
	let pom = 0;
	return (dispatch, getState) => {
		let counter = getHintAlias(getState(), alias).size;
		let loading = getLoadingAlias(getState(), alias);
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
			dispatch(setLoading(false, alias));
			dispatch(setHint(pom, alias));
		} else {
			dispatch(addHint(pom, alias));
		}
	}
}
