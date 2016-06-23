import ApiService from '../services/apiservice.js';
import { getFilterAlias, getHintAlias, getLoadingAlias } from '../selectors/selectors.jsx';

export function setProgress(bool) {
	return {
		type: 'SET_PROGRESS',
		bool
	}
};

function init(filter, alias) {
	return {
		type: 'INIT',
		filter,
		alias
	}
};

function setLoading(loading, alias) {
	return {
		type: 'SET_LOADING',
		loading,
		alias
	}
};

function addHint(list, alias) {
	debugger;
	return {
		type: 'ADD_HINT',
		hint: list,
		alias
	}
};

function setHint(list, alias) {
	return {
		type: 'SET_HINT',
		hint: list,
		alias
	}
};

export function setFilter(filter, alias) {
	return dispatch => {
		dispatch(setHint([], alias));
		dispatch(init(filter, alias));
		dispatch(setLoading(false, alias));
		if (filter !== '') {
			dispatch(setProgress(true));
			dispatch(setLoading(true, alias));
			dispatch(doRequest(filter, 0, alias));
		}
		if (filter === '') {
			dispatch(setProgress(false));
			dispatch(setHint([], alias));
		}
	}
};

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
};

function processRequest(data, filter, paging, alias) {
	return (dispatch, getState) => {
		if (getFilterAlias(getState(), alias) === filter) {
			const expr = new RegExp('\\b^' + filter.split(' ').map(exp => '(' + exp + ')').join('.*[a-zá-ž].*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni)// || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			const totalCount = parseInt(data['@rowCount']);
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(setLoading(false, alias));
				dispatch(setHint([], alias));
				dispatch(setProgress(false));
			} else {
					if (paging + 20 > totalCount)  dispatch(setProgress(false));
					dispatch(setLimit(list, alias));
					const count = paging + data.kontakt.length;
					const hintCount = getHintAlias(getState(), alias).size;
					if (totalCount > count && hintCount < 10) {
						dispatch(doRequest(filter, count, alias));
					}
			}
		} else {
			dispatch(setProgress(false));
		}
	}
};

function setLimit(list, alias) {
	return (dispatch, getState) => {
		let counter = getHintAlias(getState(), alias).size;
		let loading = getLoadingAlias(getState(), alias);
		if (loading) {
			counter = 0;
		}
		const dif = 10 - counter;
		let pom = 0;
		if (list.length > dif) {
			const partOfList = list.slice(0, -(list.length-dif));
			pom = partOfList;
		} else if (list.length <= dif) {
			pom = list;
		}
		if (loading) {
			dispatch(setLoading(false, alias));
			dispatch(setHint(pom, alias));
		} else if(pom.length > 0) {
			dispatch(addHint(pom, alias));
		}
		if (getHintAlias(getState(),alias).size === 10) dispatch(setProgress(false));
	}
};
