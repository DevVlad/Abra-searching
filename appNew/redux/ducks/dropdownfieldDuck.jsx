import Immutable from 'immutable';
import superagent from 'superagent';
import { createSelector } from 'reselect';
import Progress from './progress.jsx';
import lodash from 'lodash';

const SET_LOADING = 'SET_LOADING';
const ADD_DATA = 'ADD_DATA';
const SET_DATA = 'SET_DATA';
const SET_ENTITY = 'SET_ENTITY';
const SET_FILTER_MODE = 'SET_FILTER_MODE';
const SET_FILTER = 'SET_FILTER';
const DELETE = 'DELETE';
const SET_NO_DATA = 'SET_NO_DATA';

const getAliasState = (state, alias) => state.getIn(['dropdown', alias]);

const DropdownFieldDuck = {
	/*
	 ACTIONS
	 */
	setLoading(loading, alias) {
		return {
			type: SET_LOADING,
			loading,
			alias
		};
	},

	addData(list, alias) {
		return {
			type: ADD_DATA,
			data: list,
			alias,
		};
	},

	setData(list, alias) {
		return {
			type: SET_DATA,
			list,
			alias,
		};
	},

	findEntityById(entityType, id, alias) {
		return dispatch => {
			// will be replaced with DAO
			serviceRequestOnInsertedId(id).then(dataServer => {
				dispatch(DropdownFieldDuck.setEntity(dataServer.winstrom[entityType][0], alias));
			});
		};
	},

	setEntity(entity, alias) {
		return {
			type: SET_ENTITY,
			alias,
			entity
		};
	},

	setFilter(filter, alias) {
		return {
			type: SET_FILTER,
			alias,
			filter
		};
	},

	setDelete(alias, subjects) {
		return {
			type: DELETE,
			alias,
			subjects
		};
	},

	findDataByCondition(entityType, condition, alias) {
		return (dispatch, getState) => {
			console.trace(condition);
			if (!DropdownFieldDuck.getLoading(getState())) dispatch(DropdownFieldDuck.setLoading(true, alias));
			dispatch(DropdownFieldDuck.setLoading(true, alias));
			if (!lodash.isEmpty(condition)) {
				dispatch(Progress.start());
				// will be replaced with DAO -- esp. condition!
				serviceRequestOnChangeInput(condition.right).then(data => {
					dispatch(Progress.stop());
					dispatch(DropdownFieldDuck.setData(data.winstrom[entityType], alias));
					dispatch(DropdownFieldDuck.setNoData(alias, data.winstrom['@rowCount'] == 0));
				});
			} else {
				dispatch(DropdownFieldDuck.setData([], alias));
			}
		};
	},

	setNoData(alias, bool) {
		return {
			type: SET_NO_DATA,
			alias,
			bool
		};
	},

	/*
	 * REDUCER
	 */

	reducer(state = Immutable.fromJS({}), action) {
		switch (action.type) {

			case SET_DATA:
				return state.setIn([action.alias, 'data'], Immutable.fromJS(action.list))
					.setIn([action.alias, 'lastPaging'], action.paging)
					.setIn([action.alias, 'nextRequestPossible'], action.bool);

			case ADD_DATA:
				return state.updateIn([action.alias, 'data'], list => list.concat(Immutable.fromJS(action.data)))
					.setIn([action.alias, 'lastPaging'], action.paging)
					.setIn([action.alias, 'nextRequestPossible'], action.bool);

			case SET_LOADING:
				return state.setIn([action.alias, 'loading'], action.loading);

			case SET_ENTITY:
				return state.setIn([action.alias, 'entity'], action.entity);

			case SET_FILTER:
				return state.setIn([action.alias, 'filter'], action.filter);

			case DELETE:
				let obj = state;
				action.subjects.forEach(subject => {
					if (subject === 'data') {
						obj = obj.setIn([action.alias, 'data'], Immutable.fromJS([])).setIn([action.alias, 'noData'], undefined);
					} else {
						obj = obj.setIn([action.alias, subject], undefined);
					}
				});
				return obj;

			case SET_NO_DATA:
				console.trace('SET_NO_DATA');
				return state.setIn([action.alias, 'noData'], action.bool);

			default:
				return state;
		}
	},

	/*
	 *	SELECTORS
	 */

	getFilter(state, alias) {
		return getFilter(state, alias);
	},

	getEntityfromId(state, alias) {
		return getEntityfromId(state, alias);
	},

	getData: createSelector(getAliasState, x => {
		if (x === undefined) {
			return undefined;
		} else {
			return x.get('data');
		}
		;
	}),

	getLoading(state, alias) {
		return getLoading(state, alias);
	},

	getNoData(state, alias) {
		return getNoData(state, alias);
	}
};

const getNoData = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('noData');
	}
});

const getEntityfromId = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('entity');
	}
});

const getLoading = createSelector(getAliasState, x => {
	if (x === undefined) {
		return false;
	} else {
		return x.get('loading');
	}
});

const getEntityId = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('entityId');
	}
});

const getFilter = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('filter');
	}
});

const getFilterMode = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('filterMode');
	}
});

/*
 logic
 */

function processRequest(dataServer, filter, paging, alias, resultsToDisplay) {
	return (dispatch, getState) => {
		dispatch(Progress.stop());
		if (getFilter(getState(), alias) === filter) {
			const totalCount = parseInt(dataServer['@rowCount']);
			dispatch(DropdownFieldDuck.setNoData(alias, totalCount === 0));
			if (totalCount === 0) {
				dispatch(DropdownFieldDuck.setDelete(alias, ['data', 'loading']));
			} else {
				if (paging + 20 > totalCount) {
					dispatch(setLimit(dataServer.kontakt, alias, true, resultsToDisplay, paging, totalCount > paging + dataServer.kontakt.length));
				} else {
					dispatch(setLimit(dataServer.kontakt, alias, false, resultsToDisplay, paging, totalCount > paging + dataServer.kontakt.length));
				}
				const count = paging + dataServer.kontakt.length;
				const dataCount = DropdownFieldDuck.getData(getState(), alias).size;
				if (totalCount > count && dataCount < resultsToDisplay) {
					dispatch(progressMedium(filter, count, paging, alias, resultsToDisplay));
				}
			}
		}
	}
}

function progressMedium(filter, count, paging, alias, resultsToDisplay) {
	return (dispatch) => {
		dispatch(Progress.start());
		serviceRequestOnChangeInput(filter, count).then(dataServer =>
			dispatch(processRequest(dataServer.winstrom, filter, paging, alias, resultsToDisplay)));
	};
}

function setLimit(list, alias, boolLast, toDisplayLimit, paging, nextLoading) {
	return (dispatch, getState) => {
		let counter = DropdownFieldDuck.getData(getState(), alias).size;
		let loading = getLoading(getState(), alias);
		if (loading) {
			counter = 0;
		}
		const dif = toDisplayLimit - counter;
		let pom = 0;
		if (list.length > dif) {
			const partOfList = list.slice(0, -(list.length - dif));
			pom = partOfList;
		} else if (list.length <= dif) {
			pom = list;
		}
		if (loading) {
			dispatch(DropdownFieldDuck.setLoading(false, alias));
			if (paging === 0) dispatch(DropdownFieldDuck.setData(pom, alias, paging, nextLoading));
		} else if (pom.length > 0) {
			dispatch(DropdownFieldDuck.addData(pom, alias, paging, nextLoading));
		}
	}
}

/*
 *	SERVICE
 */

function serviceRequestOnChangeInput(filter) {
	let query = {
		'add-row-count': true,
		'start': 0,
		'limit': 10
	};
	const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];
	const inp = fields.map(f => `${f} like similar '${filter}'`).join(' or ');
	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/kontakt/${`(${encodeURIComponent(inp)})`}`)
			.set('Accept', 'application/json')
			.auth('admin', 'adminadmin')
			.query(query)
			.end((err, res)=> {
				if (!err) {
					resolve(res.body);
				} else {
					console.error('Error ApiService - ContactDropdown: ', err);
				}
			})
	});
};

function serviceRequestOnInsertedId(initId) {
	const query = {
		'add-row-count': true,
		'start': 0,
		'limit': 20
	};
	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/kontakt/${initId}`)
			.set('Accept', 'application/json')
			.auth('admin', 'adminadmin')
			.query(query)
			.end((err, res)=> {
				if (!err) {
					resolve(res.body);
				} else {
					console.error('Error ApiService - ContactDropdown: ', err);
				}
			})
	});
};

export default DropdownFieldDuck;
