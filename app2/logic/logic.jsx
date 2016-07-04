import { getFilterAlias, getHintAlias, getLoadingAlias } from '../redux/ducks/dropDownContact/selectors.jsx';

import * as actionsDDC from '../redux/ducks/dropDownContact/dropDownContact.jsx';
import * as actionsP from '../redux/ducks/progress/progress.jsx';

// const toDisplayLimit = 10;

export function setFilter(filter, alias, paging, resultsToDisplay) {
	return dispatch => {
		dispatch(actionsDDC.setEntityToText(filter, alias));
		if (paging === 0) {
			dispatch(actionsDDC.setHint([], alias, paging, false));
			dispatch(actionsDDC.init(filter, alias));
			dispatch(actionsDDC.setLoading(false, alias));
		}
		if (filter !== '') {
			dispatch(actionsP.setProgress(true));
			dispatch(actionsDDC.setLoading(true, alias));
			dispatch(doRequest(filter, paging, alias, resultsToDisplay));
		}
		if (filter === '') {
			dispatch(actionsDDC.setHint([], alias, paging, true));
			dispatch(actionsP.setProgress(false));
		}
	}
};

function doRequest(filter, paging, alias, resultsToDisplay) {
	return (dispatch) => {
		actionsDDC.serviceRequest(filter, paging, 0).then(data => dispatch(processRequest(data.winstrom, filter, paging, alias, resultsToDisplay)));
	};
};

function processRequest(data, filter, paging, alias, resultsToDisplay) {
	return (dispatch, getState) => {
		if (getFilterAlias(getState(), alias) === filter) {
			const expr = new RegExp('\\b^' + filter.split(' ').map(exp => '(' + exp + ')').join('.*[a-zá-ž].*\\b'), 'i');
			const list = data.kontakt.filter(x =>
				expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel)
			);
			const totalCount = parseInt(data['@rowCount']);
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(actionsDDC.setLoading(false, alias));
				dispatch(actionsDDC.setHint([], alias, paging, totalCount > paging+ data.kontakt.length));
				dispatch(actionsP.setProgress(false));
			} else {
					let toDisplayLimit = resultsToDisplay;
					if (paging + 20 > totalCount)  {
						dispatch(setLimit(list, alias, true, toDisplayLimit, paging, totalCount > paging+ data.kontakt.length));
					} else {
						dispatch(setLimit(list, alias, false, toDisplayLimit, paging, totalCount > paging+ data.kontakt.length));
					}
					const count = paging + data.kontakt.length;
					const hintCount = getHintAlias(getState(), alias).size;
					if (totalCount > count && hintCount < toDisplayLimit) {
						dispatch(doRequest(filter, count, alias, resultsToDisplay));
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
			if (paging === 0) dispatch(actionsDDC.setHint(pom, alias, paging, nextLoading));
		} else if(pom.length > 0) {
			dispatch(actionsDDC.addHint(pom, alias, paging, nextLoading));
		}
		if (getHintAlias(getState(),alias).size === toDisplayLimit || boolLast) dispatch(actionsP.setProgress(false));
	}
};

export function setDropdownInputValue(id, alias) {
	return dispatch => {
		if (typeof id === 'number') actionsDDC.serviceRequest('', 0, id).then(data => dispatch(entityToText(data.winstrom.kontakt, alias)));
		if (typeof id === 'string') dispatch(actionsDDC.setEntityToText(id, alias));
	};
};

function entityToText(object, alias) {
	return dispatch => {
		const textToDisplay = [object[0].prijmeni, object[0].jmeno].join(' ');
		console.log('blabla ', textToDisplay, alias)
		dispatch(actionsDDC.setEntityToText(textToDisplay, alias));

	};
};
