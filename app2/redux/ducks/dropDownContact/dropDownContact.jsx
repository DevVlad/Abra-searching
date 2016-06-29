import Immutable from 'immutable';
import superagent from 'superagent';

/*
* ACTIONS
*/

export const INIT = 'INIT';
export const SET_LOADING = 'SET_LOADING';
export const ADD_HINT = 'ADD_HINT';
export const SET_HINT = 'SET_HINT';
export const SET_VALUE_OF_INIT = 'SET_VALUE_OF_INIT';

export function init(filter, alias) {
	return {
		type: 'INIT',
		filter,
		alias
	};
};

export function setLoading(loading, alias) {
	return {
		type: 'SET_LOADING',
		loading,
		alias
	};
};

export function addHint(list, alias, paging, bool) {
	return {
		type: 'ADD_HINT',
		hint: list,
		alias,
		paging,
		bool
	};
};

export function setHint(list, alias, paging, bool) {
	return {
		type: 'SET_HINT',
		hint: list,
		alias,
		paging,
		bool
	};
};

export function setValueOfInit(text, alias) {
	return {
		type: 'SET_VALUE_OF_INIT',
		text,
		alias
	};
};

/*
* REDUCER
*/

const initialStateFilter = Immutable.fromJS({});

export function reducer (state = initialStateFilter, action) {
  switch (action.type) {

    case INIT:
      return state.setIn([action.alias, 'filter'], action.filter);

    case SET_HINT:
      return state.setIn([action.alias, 'hint'], Immutable.fromJS(action.hint))
									.setIn([action.alias, 'lastPaging'], action.paging)
									.setIn([action.alias, 'nextRequestPossible'], action.bool);

    case ADD_HINT:
      return state.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint)))
									.setIn([action.alias, 'lastPaging'], action.paging)
									.setIn([action.alias, 'nextRequestPossible'], action.bool);

    case SET_LOADING:
      return state.setIn([action.alias, 'loading'], action.loading);

		case SET_VALUE_OF_INIT:
			return state.setIn([action.alias, 'valueOfInput'], action.text);

    default:
      return state;
  }
};

/*
*	SERVICE
*/

export function serviceRequest(filter, paging, initId) {
	let query = {
		'add-row-count': true,
		'start': paging,
		'limit': 20
	};
	let spec = '';
	if (initId > 0) {
		spec = initId;
		query = {
			'add-row-count': true,
			'start': paging,
			'limit': 20
		};
	} else {
		const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];
		const inp = fields.map(f => `${f} like similar '${filter}'`).join(' or ');
		spec = `(${encodeURIComponent(inp)})`;
	}
	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/kontakt/${spec}`)
		.set('Accept', 'application/json')
		.auth('admin', 'adminadmin')
		.query(query)
		.end((err, res)=>{
			if (!err) {
				resolve(res.body);
			} else {
				console.log('Error ApiService - ContactDropdown: ', err);
			}
		})
	});

};
