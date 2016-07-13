import Immutable from 'immutable';
import superagent from 'superagent';
import _ from 'lodash';
import { createSelector } from 'reselect';
import Progress from './progress.jsx';

const SET_LOADING = 'SET_LOADING';
const ADD_HINT = 'ADD_HINT';
const SET_HINT = 'SET_HINT';
const SET_ENTITY_TO_TEXT = 'SET_ENTITY_TO_TEXT';
const SET_FILTER_MODE = 'SET_FILTER_MODE';
const SET_FILTER = 'SET_FILTER';
const DELETE = 'DELETE';

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
        dispatch(DropdownField.setFilter(filter, alias));
  			if (paging === 0) {
  				dispatch(DropdownField.setLoading(true, alias));
  			};
  			if (filter !== '') {
          dispatch(progressMedium(filter, paging, paging, alias, resultsToDisplay));
  			};
  			if (filter === '') {
  				dispatch(DropdownField.setHint([], alias, paging, true));
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
                      .setIn([action.alias, 'nextRequestPossible'], undefined);

        case SET_FILTER:
          return state.setIn([action.alias, 'filter'], action.filter);

        case DELETE:
          let obj = state;
          action.subjects.forEach(subject => {
            if (subject === 'hint') {
              obj = obj.setIn([action.alias, 'hint'], Immutable.fromJS([]));
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

    getHint(state, alias) {
      return getHint(state, alias);
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

function processRequest(data, filter, paging, alias, resultsToDisplay) {
	return (dispatch, getState) => {
    // dispatch(Progress.stop());
    dispatch(Progress.step(10))
    dispatch(Progress.step(10))
    // dispatch(Progress.step(Progress.getProgressBar(getState())))
		if (getFilter(getState(), alias) === filter) {
			const totalCount = parseInt(data['@rowCount']);
			if (totalCount === 0) {
				console.log('No data found!');
				// dispatch(DropdownField.setHint([], alias, paging, totalCount > paging+ data.kontakt.length));
        // dispatch(DropdownField.setLoading(false, alias));
        dispatch(DropdownField.setDelete(alias, ['hint', 'loading']));
			} else {
					if (paging + 20 > totalCount)  {
						dispatch(setLimit(data.kontakt, alias, true, resultsToDisplay, paging, totalCount > paging+ data.kontakt.length));
					} else {
						dispatch(setLimit(data.kontakt, alias, false, resultsToDisplay, paging, totalCount > paging+ data.kontakt.length));
					}
					const count = paging + data.kontakt.length;
					const hintCount = getHint(getState(), alias).size;
					if (totalCount > count && hintCount < resultsToDisplay) {
            dispatch(progressMedium(filter, count, paging, alias, resultsToDisplay));
					}
			}
		}
	}
};

function progressMedium(filter, count, paging, alias, resultsToDisplay) {
  return (dispatch) => {
    dispatch(Progress.start(20));
    serviceRequestOnChangeInput(filter, count).then(data => dispatch(processRequest(data.winstrom, filter, paging, alias, resultsToDisplay)));
  };
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
