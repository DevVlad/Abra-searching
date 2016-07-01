import Immutable from 'immutable';
import superagent from 'superagent';
import _ from 'lodash';
import { createSelector } from 'reselect';

const SET_LOADING = 'SET_LOADING';
const ADD_HINT = 'ADD_HINT';
const SET_HINT = 'SET_HINT';
const SET_ENTITY_TO_TEXT = 'SET_ENTITY_TO_TEXT';
// const SET_CONDITION = 'SET_CONDITION';
const SET_FILTER = 'SET_FILTER';

const getAliasState = (state, alias) => state.getIn(['filter', alias]);

const DropdownField = {
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

  	addHint(list, alias, paging, bool) {
  		return {
  			type: ADD_HINT,
  			hint: list,
  			alias,
  			paging,
  			bool
  		};
  	},

  	setHint(list, alias, paging, bool) {
  		return {
  			type: SET_HINT,
  			list,
  			alias,
  			paging,
  			bool
  		};
  	},

  	setValueOfEntityToText(id, alias) {
  		return dispatch => {
  				serviceRequestOnInsertedId(id).then(data => dispatch(DropdownField.setEntityToText(data.winstrom.kontakt[0], alias)));
  			};
  	},

  	setEntityToText(object, alias) {
  		return {
  			type: SET_ENTITY_TO_TEXT,
  			alias,
  			object
  		};
  	},

  	// setCondition(text, alias) {
  	// 	let condition = {
  	// 		type: 'comp',
  	// 		operator: 'like similar',
  	// 		left: 'jmeno',
  	// 		right: text
  	// 	};
  	// 	return {
  	// 		type: SET_CONDITION,
  	// 		alias,
  	// 		condition
  	// 	};
  	// },

    setFilter(filter, alias) {
      return {
        type: SET_FILTER,
        alias,
        filter
      };
    },

    setList(filter, alias, paging, resultsToDisplay) {
  		return dispatch => {
        dispatch(DropdownField.setFilter(filter, alias));
  			if (paging === 0) {
  				dispatch(DropdownField.setHint([], alias, 0, false));
  				dispatch(DropdownField.setLoading(false, alias));
  			};
  			if (filter !== '') {
  				// dispatch(actionsP.setProgress(true));
  				dispatch(DropdownField.setLoading(true, alias));
  				serviceRequestOnChangeInput(filter, paging).then(data => dispatch(processRequest(data.winstrom, filter, paging, alias, resultsToDisplay)));
  			};
  			if (filter === '') {
  				dispatch(DropdownField.setHint([], alias, paging, true));
  				// dispatch(actionsP.setProgress(false));
  			};
  		};
  	},

    /*
    * REDUCER
    */

    reducer(state = Immutable.fromJS({}), action) {
      switch (action.type) {

        case SET_HINT:
          return state.setIn([action.alias, 'hint'], Immutable.fromJS(action.list))
                      .setIn([action.alias, 'lastPaging'], action.paging)
                      .setIn([action.alias, 'nextRequestPossible'], action.bool);

        case ADD_HINT:
          return state.updateIn([action.alias, 'hint'], list => list.concat(Immutable.fromJS(action.hint)))
                      .setIn([action.alias, 'lastPaging'], action.paging)
                      .setIn([action.alias, 'nextRequestPossible'], action.bool);

        case SET_LOADING:
          return state.setIn([action.alias, 'loading'], action.loading);

        case SET_ENTITY_TO_TEXT:
          return state.setIn([action.alias, 'entityToText'], action.object)
                      .setIn([action.alias, 'nextRequestPossible'], false);

        // case SET_CONDITION:
        //   return state.setIn([action.alias, 'filterToCondition'], Immutable.fromJS(action.condition));

        case SET_FILTER:
          return state.setIn([action.alias, 'filter'], action.filter);

        default:
          return state;
      }
    },

    /*
  	*	SELECTORS
  	*/

  	getOwnState(state, alias) {
  		let obj = {
  			entityToText: getEntityToText(state, alias),
  			hint: getHint(state, alias)
  		};
  		return obj;
  	}
};

const getEntityToText = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('entityToText');
	};
});

const getHint = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('hint');
	};
});

const getLoading = createSelector(getAliasState, x => {
	if (x === undefined) {
		return false;
	} else {
		return x.get('loading');
	};
});

const getEntityId = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('entityId');
	};
});

const getFilter = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('filter');
	};
});

/*
logic
*/

function processRequest(data, filter, paging, alias, resultsToDisplay) {
	return (dispatch, getState) => {
		if (getFilter(getState(), alias) === filter) {
			const totalCount = parseInt(data['@rowCount']);
			if (totalCount === 0) {
				console.log('No data found!');
				dispatch(DropdownField.setHint([], alias, paging, totalCount > paging+ data.kontakt.length));
        dispatch(DropdownField.setLoading(false, alias));
				// dispatch(actionsP.setProgress(false));
			} else {
					if (paging + 20 > totalCount)  {
						dispatch(setLimit(data.kontakt, alias, true, resultsToDisplay, paging, totalCount > paging+ data.kontakt.length));
					} else {
						dispatch(setLimit(data.kontakt, alias, false, resultsToDisplay, paging, totalCount > paging+ data.kontakt.length));
					}
					const count = paging + data.kontakt.length;
					const hintCount = getHint(getState(), alias).size;
					if (totalCount > count && hintCount < resultsToDisplay) {
						serviceRequestOnChangeInput(filter, count).then(data => processRequest(data, filter, paging, alias, resultsToDisplay));
					}
			}
		} else {
			// dispatch(actionsP.setProgress(false));
		}
	}
};

function setLimit(list, alias, boolLast, toDisplayLimit, paging, nextLoading) {
	return (dispatch, getState) => {
		let counter = getHint(getState(), alias).size;
		let loading = getLoading(getState(), alias);
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
			dispatch(DropdownField.setLoading(false, alias));
			if (paging === 0) dispatch(DropdownField.setHint(pom, alias, paging, nextLoading));
		} else if(pom.length > 0) {
			dispatch(DropdownField.addHint(pom, alias, paging, nextLoading));
		}
		// if (getHint(getState(),alias).size === toDisplayLimit || boolLast) dispatch(setProgress(false));
	}
};

/*
*	SERVICE
*/

function serviceRequestOnChangeInput(filter, paging) {
	let query = {
		'add-row-count': true,
		'start': paging,
		'limit': 20
	};
	const fields = ['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];
	const inp = fields.map(f => `${f} like similar '${filter}'`).join(' or ');
	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/kontakt/${`(${encodeURIComponent(inp)})`}`)
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
		.end((err, res)=>{
			if (!err) {
				resolve(res.body);
			} else {
				console.log('Error ApiService - ContactDropdown: ', err);
			}
		})
	});
};

export default DropdownField;
