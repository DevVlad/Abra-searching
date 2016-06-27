// import ApiService from '../services/apiservice.js';
import { getFilterAlias, getHintAlias, getLoadingAlias } from '../redux/ducks/dropDownContact/selectors.jsx';

import * as actionsDDC from '../redux/ducks/dropDownContact/dropDownContact.jsx';
import * as actionsP from '../redux/ducks/progress/progress.jsx';

// const toDisplayLimit = 10;

export function setFilter(filter, alias, paging) {
	return dispatch => {
		dispatch(actionsDDC.setHint([], alias, paging));
		dispatch(actionsDDC.init(filter, alias));
		dispatch(actionsDDC.setLoading(false, alias));
		if (filter !== '') {
			dispatch(actionsP.setProgress(true));
			dispatch(actionsDDC.setLoading(true, alias));
			dispatch(doRequest(filter, 0, alias, paging));
		}
		if (filter === '') {
			dispatch(actionsDDC.setHint([], alias, paging));
			dispatch(actionsP.setProgress(false));
		}
	}
};

// const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];
//
// function doRequest(filter, paging = 0, alias) {
// 	return dispatch => {
// 		// let data = REQUEST({ 'add-row-count': true, 'start': paging, 'limit': 20 }, fields);
// 		ApiService.getRequest({ 'add-row-count': true, 'start': paging, 'limit': 20 },
// 			fields.map(f => `${f} like similar '${filter}'`).join(' or ')
// 		).then(data => {
// 			setTimeout(() => {
// 					dispatch(processRequest(data.winstrom, filter, paging, alias));
// 			}, 0);
// 		});
// 	}
// };

function doRequest(filter, paging, alias) {
	return (dispatch) => {
		actionsDDC.request(filter, paging).then(data => dispatch(processRequest(data.winstrom, filter, paging, alias)));
	};
};

function processRequest(data, filter, paging, alias) {
	return (dispatch, getState) => {
		if (getFilterAlias(getState(), alias) === filter) {
			const expr = new RegExp('\\b^' + filter.split(' ').map(exp => '(' + exp + ')').join('.*[a-zá-ž].*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni)// || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			const totalCount = parseInt(data['@rowCount']);
			const toDisplayLimit = 10;
			console.log(totalCount > toDisplayLimit)
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(actionsDDC.setLoading(false, alias));
				dispatch(actionsDDC.setHint([], alias), paging);
				dispatch(actionsP.setProgress(false));
			} else {
					if (paging + 20 > totalCount)  {
						dispatch(setLimit(list, alias, true, toDisplayLimit, paging, totalCount > toDisplayLimit));
					} else {
						dispatch(setLimit(list, alias, false, toDisplayLimit, paging, totalCount > toDisplayLimit));
					}
					const count = paging + data.kontakt.length;
					const hintCount = getHintAlias(getState(), alias).size;
					if (totalCount > count && hintCount < toDisplayLimit) {
						dispatch(doRequest(filter, count, alias));
					}
			}
		} else {
			dispatch(actionsP.setProgress(false));
		}
	}
};

function setLimit(list, alias, boolLast, toDisplayLimit, paging, nextLoading) {
	return (dispatch, getState) => {
		let counter = getHintAlias(getState(), alias).size;
		let loading = getLoadingAlias(getState(), alias);
		if (loading) {
			counter = 0;
		}
		const dif = toDisplayLimit - counter;
		let pom = 0;
		if (list.length > dif) {
			const partOfList = list.slice(0, -(list.length-dif));
			pom = partOfList;
		} else if (list.length <= dif) {
			pom = list;
		}
		if (loading) {
			dispatch(actionsDDC.setLoading(false, alias));
			dispatch(actionsDDC.setHint(pom, alias, paging));
		} else if(pom.length > 0) {
			dispatch(actionsDDC.addHint(pom, alias, paging, nextLoading));
		}
		if (getHintAlias(getState(),alias).size === toDisplayLimit || boolLast) dispatch(actionsP.setProgress(false));
	}
};
