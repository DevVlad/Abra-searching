import Immutable from 'immutable';
import superagent from 'superagent';
import _ from 'lodash';
import { createSelector } from 'reselect';
import Progress from './progress.jsx';

const SET_LOADING = 'SET_LOADING';
const ADD_DATA = 'ADD_DATA';
const SET_DATA = 'SET_DATA';
const SET_ENTITY_TO_TEXT = 'SET_ENTITY_TO_TEXT';
const SET_FILTER_MODE = 'SET_FILTER_MODE';
const SET_FILTER = 'SET_FILTER';
const DELETE = 'DELETE';

const getAliasState = (state, alias) => state.getIn(['filter', alias]);

const DropdownFieldOld = {
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

  	setValueOfEntityToText(id, alias) {
  		return dispatch => {
  				serviceRequestOnInsertedId(id).then(dataServer => dispatch(DropdownFieldOld.setEntityToText(dataServer.winstrom.kontakt[0], alias)));
  			};
  	},

  	setEntityToText(object, alias) {
  		return {
  			type: SET_ENTITY_TO_TEXT,
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

    setFilterMode(alias, bool) {
      return {
        type: SET_FILTER_MODE,
        alias,
        bool
      };
    },

    setList(filter, alias, paging, resultsToDisplay) {
  		return dispatch => {
        dispatch(DropdownFieldOld.setFilter(filter, alias));
  			if (paging === 0) {
  				dispatch(DropdownFieldOld.setLoading(true, alias));
  			};
  			if (filter !== '') {
          dispatch(progressMedium(filter, paging, paging, alias, resultsToDisplay));
  			};
  			if (filter === '') {
  				dispatch(DropdownFieldOld.setData([], alias, paging, true));
  			};
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

        case SET_ENTITY_TO_TEXT:
          return state.setIn([action.alias, 'entityToText'], action.object)
                      .setIn([action.alias, 'nextRequestPossible'], undefined);

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

        case SET_FILTER_MODE:
          return state.setIn([action.alias, 'filterMode'], action.bool);

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

    getEntityToText(state, alias) {
      return getEntityToText(state, alias);
    },

    getData(state, alias) {
      return getData(state, alias);
    },

    getFilterMode(state, alias) {
      return getFilterMode(state, alias);
    },

    getLoading(state, alias) {
      return getLoading(state, alias);
    },
};

const getEntityToText = createSelector(getAliasState, x => {
	if (x === undefined) {
		return undefined;
	} else {
		return x.get('entityToText');
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
    // dispatch(Progress.start());
    // dispatch(Progress.step(10));
    // setTimeout( () => {
    //   dispatch(Progress.stop());
    // },1000)
    dispatch(Progress.stop());
    // dispatch(Progress.step(10));
    // dispatch(Progress.step(10));

    // dispatch(Progress.step(Progress.getProgressBar(getState())))
		if (getFilter(getState(), alias) === filter) {
			const totalCount = parseInt(dataServer['@rowCount']);
			if (totalCount === 0) {
				console.log('No dataServer found!');
				// dispatch(DropdownFieldOld.setData([], alias, paging, totalCount > paging+ dataServer.kontakt.length));
        // dispatch(DropdownFieldOld.setLoading(false, alias));
        dispatch(DropdownFieldOld.setDelete(alias, ['data', 'loading']));
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
			dispatch(DropdownFieldOld.setLoading(false, alias));
			if (paging === 0) dispatch(DropdownFieldOld.setData(pom, alias, paging, nextLoading));
		} else if(pom.length > 0) {
			dispatch(DropdownFieldOld.addData(pom, alias, paging, nextLoading));
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

export default DropdownFieldOld;
