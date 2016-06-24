// import ApiService from '../services/apiservice.js';
import { getFilterAlias, getHintAlias, getLoadingAlias } from '../selectors/selectors.jsx';

import * as actionsDDC from '../redux/ducks/dropDownContact.jsx';
import * as actionsP from '../redux/ducks/progress.jsx';

export function setFilter(filter, alias) {
	return dispatch => {
		dispatch(actionsDDC.setHint([], alias));
		dispatch(actionsDDC.init(filter, alias));
		dispatch(actionsDDC.setLoading(false, alias));
		if (filter !== '') {
			dispatch(actionsP.setProgress(true));
			dispatch(actionsDDC.setLoading(true, alias));
			dispatch(doRequest(filter, 0, alias));
		}
		if (filter === '') {
			dispatch(actionsDDC.setHint([], alias));
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

function doRequest(filter, paging = 0, alias) {
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
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(actionsDDC.setLoading(false, alias));
				dispatch(actionsDDC.setHint([], alias));
				dispatch(actionsP.setProgress(false));
			} else {
					if (paging + 20 > totalCount)  {
						dispatch(setLimit(list, alias, true));
					} else {
						dispatch(setLimit(list, alias, false));
					}
					const count = paging + data.kontakt.length;
					const hintCount = getHintAlias(getState(), alias).size;
					if (totalCount > count && hintCount < 10) {
						dispatch(doRequest(filter, count, alias));
					}
			}
		} else {
			dispatch(actionsP.setProgress(false));
		}
	}
};

function setLimit(list, alias, boolLast) {
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
			dispatch(actionsDDC.setLoading(false, alias));
			dispatch(actionsDDC.setHint(pom, alias));
		} else if(pom.length > 0) {
			dispatch(actionsDDC.addHint(pom, alias));
		}
		if (getHintAlias(getState(),alias).size === 10 || boolLast) dispatch(actionsP.setProgress(false));
	}
};
