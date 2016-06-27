import Immutable from 'immutable';
import superagent from 'superagent';

/*
* ACTIONS
*/

export const SET_PROGRESS = 'SET_PROGRESS';
export const INIT = 'INIT';
export const SET_LOADING = 'SET_LOADING';
export const ADD_HINT = 'ADD_HINT';
export const SET_HINT = 'SET_HINT';

export function setProgress(bool) {
	return {
		type: 'SET_PROGRESS',
		bool
	};
};

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

export function addHint(list, alias) {
	return {
		type: 'ADD_HINT',
		hint: list,
		alias
	};
};

export function setHint(list, alias) {
	return {
		type: 'SET_HINT',
		hint: list,
		alias
	};
};

/*
* REDUCER
*/

const initialStateFilter = Immutable.fromJS({});

export default function reducer (state = initialStateFilter, action) {
  switch (action.type) {

    case INIT:
      return state.setIn([action.alias, 'filter'], action.filter);

    case SET_HINT:
      return state.setIn([action.alias, 'hint'], Immutable.fromJS(action.hint));

    case ADD_HINT:
      return state.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint)));

    case SET_LOADING:
      return state.setIn([action.alias, 'loading'], action.loading);

    default:
      return state;
  }
};

/*
*	SERVICE
*/

export function request(filter, paging) {
	let query = {
		'add-row-count': true,
		'start': paging,
		'limit': 20
	};
	const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];
	const inp = fields.map(f => `${f} like similar '${filter}'`).join(' or ');

	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/kontakt/(${encodeURIComponent(inp)})`)
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
