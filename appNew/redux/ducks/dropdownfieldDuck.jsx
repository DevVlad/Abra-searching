import Immutable from 'immutable';
import superagent from 'superagent';
import { createSelector } from 'reselect';
import Progress from './progress.jsx';

const SET_LOADING = 'SET_LOADING';
const ADD_DATA = 'ADD_DATA';
const SET_DATA = 'SET_DATA';
const FIND_ENTITY_FROM_ID = 'FIND_ENTITY_FROM_ID';
const SET_FILTER_MODE = 'SET_FILTER_MODE';
const SET_FILTER = 'SET_FILTER';
const DELETE = 'DELETE';
const SET_ERROR_MSG = 'SET_ERROR_MSG';

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

  	addData(list, alias, paging, bool) {
  		return {
  			type: ADD_DATA,
  			data: list,
  			alias,
  			paging,
  			bool
  		};
  	},

  	setData(list, alias, paging, bool) {
  		return {
  			type: SET_DATA,
  			list,
  			alias,
  			paging,
  			bool
  		};
  	},

  	setValueOfEntityId(entity, id, alias) {
  		return dispatch => {
  				serviceRequestOnInsertedId(id).then(dataServer => dispatch(DropdownFieldDuck.setEntityToText(dataServer.winstrom.kontakt[0], alias)));
  			};
  	},

  	setEntityToText(object, alias) {
  		return {
  			type: FIND_ENTITY_FROM_ID,
  			alias,
  			object
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

    setDataForMenu(entity, condition, alias) {
      return (dispatch, getState) => {
        dispatch(DropdownFieldDuck.setDelete(alias, ['data']));
        if (!DropdownFieldDuck.getLoading(getState())) dispatch(DropdownFieldDuck.setLoading(true, alias));
        dispatch(DropdownFieldDuck.setList(condition.right, alias, 0, 10));
      };
    },

    setList(filter, alias, paging, resultsToDisplay) {
  		return dispatch => {
        dispatch(DropdownFieldDuck.setDelete(alias,['data']));
        dispatch(DropdownFieldDuck.setFilter(filter, alias));
  			if (paging === 0) {
  				dispatch(DropdownFieldDuck.setLoading(true, alias));
  			};
  			if (filter !== '') {
          dispatch(progressMedium(filter, paging, paging, alias, resultsToDisplay));
  			};
  			if (filter === '') {
  				dispatch(DropdownFieldDuck.setData([], alias, paging, true));
  			};
  		};
  	},

    setErrorMessage(alias, msg) {
      return {
        type: SET_ERROR_MSG,
        alias,
        msg
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

        case FIND_ENTITY_FROM_ID:
          return state.setIn([action.alias, 'entity'], action.object);

        case SET_FILTER:
          return state.setIn([action.alias, 'filter'], action.filter);

        case DELETE:
          let obj = state;
          action.subjects.forEach(subject => {
            if (subject === 'data') {
              obj = obj.setIn([action.alias, 'data'], Immutable.fromJS([]));
            } else {
              obj = obj.setIn([action.alias, subject], undefined);
            }
          });
          return obj;

        case SET_ERROR_MSG:
          return state.setIn([action.alias, 'errorText'], action.msg);

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
      return getValueOfEntityFromId(state, alias);
    },

    getData(state, alias) {
      return getData(state, alias);
    },

    getLoading(state, alias) {
      return getLoading(state, alias);
    },

    getErrorText(state, alias) {
      return getErrorText(state, alias);
    }
};

const getErrorText = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('errorText');
	};
});

const getValueOfEntityFromId = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('entity');
	};
});

const getData = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('data');
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

const getFilterMode = createSelector(getAliasState, x => {
  if (x === undefined) {
    return undefined;
  } else {
    return x.get('filterMode');
  };
});

/*
logic
*/

function processRequest(dataServer, filter, paging, alias, resultsToDisplay) {
	return (dispatch, getState) => {
    dispatch(Progress.stop());
		if (getFilter(getState(), alias) === filter) {
			const totalCount = parseInt(dataServer['@rowCount']);
			if (totalCount === 0) {
        const msg = `No data found on server for inserted filter: ${filter}.`
        dispatch(DropdownFieldDuck.setErrorMessage(alias, msg))
        dispatch(DropdownFieldDuck.setDelete(alias, ['data', 'loading']));
			} else {
					if (paging + 20 > totalCount)  {
						dispatch(setLimit(dataServer.kontakt, alias, true, resultsToDisplay, paging, totalCount > paging+ dataServer.kontakt.length));
					} else {
						dispatch(setLimit(dataServer.kontakt, alias, false, resultsToDisplay, paging, totalCount > paging+ dataServer.kontakt.length));
					}
					const count = paging + dataServer.kontakt.length;
					const dataCount = getData(getState(), alias).size;
					if (totalCount > count && dataCount < resultsToDisplay) {
            dispatch(progressMedium(filter, count, paging, alias, resultsToDisplay));
					}
			}
		}
	}
};

function progressMedium(filter, count, paging, alias, resultsToDisplay) {
  return (dispatch) => {
    dispatch(Progress.start());
    serviceRequestOnChangeInput(filter, count).then(dataServer => dispatch(processRequest(dataServer.winstrom, filter, paging, alias, resultsToDisplay)));
  };
};

function setLimit(list, alias, boolLast, toDisplayLimit, paging, nextLoading) {
	return (dispatch, getState) => {
		let counter = getData(getState(), alias).size;
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
			dispatch(DropdownFieldDuck.setLoading(false, alias));
			if (paging === 0) dispatch(DropdownFieldDuck.setData(pom, alias, paging, nextLoading));
		} else if(pom.length > 0) {
			dispatch(DropdownFieldDuck.addData(pom, alias, paging, nextLoading));
		}
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

export default DropdownFieldDuck;
